using System.Net.WebSockets;

namespace Office.API.WebSockets
{
    public class WebSocketOwner
    {
        public  WebSocket WebSocket {get; private set;}
        public bool IsConnected 
        {
            get
            {
                return WebSocket.State == WebSocketState.Open;
            }
        }
        public int OwnerId {get;}
        public WebSocketOwner(int id, WebSocket webSocket)
        {
            WebSocket = webSocket;
            OwnerId = id;
        }

        public void AssignNewWebSocket(WebSocket websocket)
        {
            this.WebSocket = websocket;
        }


    }
}