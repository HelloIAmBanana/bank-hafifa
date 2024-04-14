export type Notification = {
    id: string;
    accountID: string;
    type: "cardDeclined"|"cardApproved"|"loanDeclined"|"loanApproved"|"newTransaction"|"newDepositOffer"|"DepositWithdrawn";
  };
  