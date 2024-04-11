export type Deposit = {
    id: string;
    depositAmount: string;
    interest: string;
    accountID: string;
    status: "accepted" | "offered";
    expireTime: string;
  };
  