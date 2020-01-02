export interface Message {
    id: number;
    senderId: number;
    recieverId: number;
    messageContent: string;
    date: Date;
    messageType: number;
    viewed: boolean;
}
