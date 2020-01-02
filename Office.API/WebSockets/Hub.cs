using System;
using System.Collections.Generic;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;
using Office.API.WebSockets;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System.Linq;
using System.Text;
using Newtonsoft.Json.Serialization;
using Office.API.Models;
using Office.API.Data;
using Office.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Concurrent;

namespace Office.API.Websockets
{
    public enum MessageType
    {
        OpenConnection = 0,
        CloseConnection = 1,
        Message = 2,
        AllConnected = 3,
        RequestUnreadMessages = 4,
        RequestMessagesFromSpecificSender = 5
    }
    public class Hub
    {
        static Hub messagesHub;
        public static Hub MessagesHub
        {
            get; set;
        }

        private DataContext _dbContext;

        public Hub(DataContext dbContext)
        {
            messagesHub = this;
            _dbContext = dbContext;
        }

        private ConcurrentDictionary<int, WebSocketOwner> sockets = new ConcurrentDictionary<int, WebSocketOwner>();
        Task connectionHandlerTask;

        async void ConnectionsHandler()
        {
            bool anyConnection = true;
            while (anyConnection)
            {
                anyConnection = false;
                foreach (var socket in sockets.Values)
                {
                    if (socket.WebSocket == null || socket.WebSocket.State != WebSocketState.Open && socket.WebSocket.State != WebSocketState.Connecting)
                    {
                        int disconnectedId = socket.OwnerId;
                        WebSocketOwner ws;
                        bool removed = false;

                        int attempts = 100;
                        while (!removed && attempts > 0)
                        {
                            removed = sockets.TryRemove(socket.OwnerId, out ws);
                            attempts--;
                            Thread.Sleep(10);
                        }

                        foreach (var socket2 in sockets.Values)
                        {
                            if (socket2.WebSocket.State != WebSocketState.Open) continue;

                            var message = new MessageJSON(MessageType.CloseConnection, socket2.OwnerId, socket2.OwnerId, disconnectedId.ToString());
                            var bytes = Serialize(message);
                            await socket2.WebSocket.SendAsync(new ArraySegment<byte>(bytes, 0, bytes.Length), WebSocketMessageType.Text, true, CancellationToken.None);
                        }
                    }
                    else
                    {
                        anyConnection = true;
                    }
                }
                Thread.Sleep(1000);
            }
            connectionHandlerTask = null;
        }

        public async Task OpenConnection(HttpContext context, WebSocket webSocket)
        {
            var buffer = new byte[1024 * 4];
            WebSocketReceiveResult result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

            while (!result.CloseStatus.HasValue)
            {
                //Deserialize message from byte[]
                MessageJSON messageJSON = Deserialize<MessageJSON>(buffer);

                if (messageJSON == null) return;

                //Check if socket with sender id is already added
                WebSocketOwner existingSocket = TryGetSocket(messageJSON.SenderId);

                //if socket doesn't exist add it, if exists check if open, if not assign new websocket
                if (existingSocket == null)
                {
                    sockets.TryAdd(messageJSON.SenderId, new WebSocketOwner(messageJSON.SenderId, webSocket));
                }
                else if (existingSocket.WebSocket.State != WebSocketState.Open)
                {
                    existingSocket.AssignNewWebSocket(webSocket);
                }

                bool broadcastAll = BroadcastAll(messageJSON.MessageType);

                if (!broadcastAll)
                {
                    byte[] bytes = null;
                    WebSocketOwner socket = null;
                    MessageJSON message = messageJSON;

                    switch (messageJSON.MessageType)
                    {
                        case MessageType.Message:
                            socket = TryGetSocket(messageJSON.RecieverId);
                            message.Id = await AddToDataMessages(messageJSON, socket != null);
                            break;

                        case MessageType.RequestUnreadMessages:
                            socket = TryGetSocket(messageJSON.RecieverId);
                            message = await GetUnreadMessages(socket.OwnerId);
                            break;

                        case MessageType.AllConnected:
                            //Request gets back to sender
                            socket = TryGetSocket(messageJSON.SenderId);
                            message = new MessageJSON(MessageType.AllConnected, messageJSON.SenderId, messageJSON.SenderId, GetConnectedUsers());
                            break;

                        case MessageType.RequestMessagesFromSpecificSender:
                            //Request gets back to sender
                            socket = TryGetSocket(messageJSON.SenderId);
                            var dbMessages = await GetMessages(messageJSON.RecieverId, messageJSON.SenderId);
                            if(dbMessages == null) dbMessages = new Message[0];
                            message = new MessageJSON(MessageType.RequestMessagesFromSpecificSender, messageJSON.SenderId, messageJSON.SenderId, ConvertToJSON(dbMessages));
                            break;
                    }

                    if (message != null)
                        bytes = Serialize(message);

                    if (bytes != null && socket != null && socket.WebSocket.State == WebSocketState.Open)
                        await socket.WebSocket.SendAsync(new ArraySegment<byte>(bytes, 0, bytes.Length), result.MessageType, result.EndOfMessage, CancellationToken.None);
                }
                else
                {
                    //Send broadcast to all sockets
                    foreach (var socket in sockets.Values)
                    {
                        if (socket.WebSocket.State != WebSocketState.Open) continue;

                        switch (messageJSON.MessageType)
                        {
                            case MessageType.OpenConnection:
                                await socket.WebSocket.SendAsync(new ArraySegment<byte>(buffer, 0, result.Count), result.MessageType, result.EndOfMessage, CancellationToken.None);
                                break;

                            case MessageType.CloseConnection:
                                if (socket.OwnerId == messageJSON.SenderId)
                                    await socket.WebSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "", CancellationToken.None);
                                break;
                        }
                    }
                }

                CheckConnectionHandler();

                Array.Clear(buffer, 0, buffer.Length);
                if (webSocket.State == WebSocketState.Open)
                    result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            }
        }

        T Deserialize<T>(byte[] buffer)
        {
            string result = System.Text.Encoding.UTF8.GetString(buffer).TrimEnd('\0');
            return JsonConvert.DeserializeObject<T>(result);
        }

        byte[] Serialize(object objectToSerialize)
        {
            return Encoding.UTF8.GetBytes(ConvertToJSON(objectToSerialize));
        }

        string ConvertToJSON(object obj)
        {
            return JsonConvert.SerializeObject(obj, new JsonSerializerSettings()
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            });
        }

        string GetConnectedUsers()
        {
            string connectedUsers = "[";
            List<int> connectedSockets = new List<int>();
            foreach (var socket in sockets.Values)
            {
                if (socket.IsConnected)
                {
                    connectedSockets.Add(socket.OwnerId);
                }
            }

            for (int i = 0; i < connectedSockets.Count; i++)
            {
                connectedUsers += i == 0 ? connectedSockets[i].ToString() : ", " + connectedSockets[i];
            }

            connectedUsers += "]";
            return connectedUsers;
        }

        void CheckConnectionHandler()
        {
            if (connectionHandlerTask == null)
            {
                connectionHandlerTask = new Task(() => ConnectionsHandler());
                connectionHandlerTask.Start();
            }
        }

        async Task<int> AddToDataMessages(MessageJSON messageJSON, bool viewed)
        {
            if (messageJSON.MessageType != MessageType.Message) return -1;
            var message = new Message()
            {
                SenderId = messageJSON.SenderId,
                recieverId = messageJSON.RecieverId,
                Date = DateTime.Now,
                MessageContent = messageJSON.MessageContent,
                Viewd = viewed
            };

            if (_dbContext != null)
            {
                try
                {
                    await _dbContext.Messages.AddAsync(message);
                    await _dbContext.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    var exception = ex;
                }

            }

            return message.Id;
        }

        bool BroadcastAll(MessageType messageType)
        {
            switch (messageType)
            {
                case MessageType.AllConnected:
                case MessageType.Message:
                case MessageType.RequestUnreadMessages:
                case MessageType.RequestMessagesFromSpecificSender:
                    return false;

                default:
                    return true;
            }
        }

        async Task<MessageJSON> GetUnreadMessages(int requestOwnerId)
        {
            var messages = await _dbContext.Messages.Where(x => x.recieverId == requestOwnerId && !x.Viewd).ToArrayAsync();
            if (messages == null) return null;
            var messagesJson = new MessageJSON[messages.Length];
            for (int i = 0; i < messages.Length; i++)
            {
                messagesJson[i] = new MessageJSON()
                {
                    MessageType = MessageType.Message,
                    SenderId = messages[i].SenderId,
                    RecieverId = messages[i].recieverId,
                    MessageContent = messages[i].MessageContent,
                    Id = messages[i].Id
                };
            }

            var json = JsonConvert.SerializeObject(messagesJson, new JsonSerializerSettings()
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            });
            var messageJSON = new MessageJSON(MessageType.RequestUnreadMessages, requestOwnerId, requestOwnerId, json);
            return messageJSON;
        }

        //Check if socket with this owner was added
        private WebSocketOwner TryGetSocket(int socketOwner)
        {
            WebSocketOwner existingSocket = null;
            sockets.TryGetValue(socketOwner, out existingSocket);
            return existingSocket;
        }

        private async Task<Message[]> GetMessages(int socketOwner, int senderId, int startIndex = 1)
        {
            var messages = await _dbContext.Messages.Where(x => ((x.recieverId == socketOwner && x.SenderId == senderId)
            || (x.SenderId == socketOwner && x.recieverId == senderId))).ToArrayAsync();

            if (messages != null && messages.Length > 0)
            {
                messages = messages.TakeLast(startIndex * 30).ToArray();

                foreach (var message in messages)
                    message.Viewd = true;


                await _dbContext.SaveChangesAsync();
            }


            return messages;
        }
    }





}