export type Card = {
  id: string;
  cardNumber: number;
  accountID: string;
  ownerName:string;
  type: string;
  expireDate: string;
  hiddenPin: number;
  status: "approved" | "rejected" | "pending";
  rejectedMessage: string;
};
