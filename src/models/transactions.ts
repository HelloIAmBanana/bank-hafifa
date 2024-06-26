export type Transaction = {
  id: string;
  senderID: string;
  receiverID: string;
  reason: string;
  amount: number;
  senderName: string;
  receiverName: string;
  date: string;
};