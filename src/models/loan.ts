export type Loan = {
  id: string;
  loanAmount: string;
  paidBack: number;
  interest: string;
  accountID: string;
  loanOwner:string;
  status: "approved" | "offered" | "pending"|"rejected";
  expireDate: string;
  message: string;
};
