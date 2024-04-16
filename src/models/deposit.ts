export type Deposit = {
    id: string;
    expireDate: string;
    depositOwner: string;
    accountID: string;
    status: "Active" | "Offered" | "Withdrawable";
    depositAmount: number;
    interest: number;
  };