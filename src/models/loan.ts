export type Loan = {
  id: string;
  loanAmount: number;
  paidBack: number;
  interest: number;
  accountID: string;
  loanOwner: string;
  status: "approved" | "offered" | "pending" | "rejected";
  expireDate: string;
};
