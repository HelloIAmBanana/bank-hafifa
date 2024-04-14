export type Notification = {
    id: string;
    accountID: string;
    type: NotificationType;
  };
  
export type NotificationType="cardDeclined"|"cardApproved"|"loanDeclined"|"loanApproved"|"newTransaction"|"newDepositOffer"|"DepositWithdrawn";
