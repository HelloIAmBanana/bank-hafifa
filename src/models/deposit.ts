export type Deposit = {
    id: string;
    expireDate: string;
    depositOwner: string;
    accountID: string;
    status: "Active" | "Offered" | "Withdrawn";
    depositAmount: number;
    interest: number;
  };