using Office.API.WebSockets;

namespace Office.API.Websockets
{
    public class MessageJSON
    {
        public MessageJSON()
        {

        }

        public MessageJSON(MessageType messageType, int senderId, int recieverId, string messageContent)
        {
            this.MessageContent = messageContent;
            this.RecieverId = recieverId;
            this.SenderId = senderId;
            this.MessageType = messageType;
        }
        public MessageType MessageType {get;set;}
        public int SenderId {get;set;}
        public int RecieverId {get;set;}
        public string MessageContent {get; set;}

        public int Id {get; set;} = -1;
    }
}