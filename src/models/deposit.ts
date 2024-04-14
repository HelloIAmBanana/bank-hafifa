export type Deposit = {
    id: string;
    expireTime: string;
    depositOwner: string;
    accountID: string;
    status: "Active" | "Offered" | "Withdrawn";
    depositAmount: number;
    interest: number;
  };