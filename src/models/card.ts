export type Card = {
      cardNumber: number;
      accountID: string;
      type: string;
      expireDate: string;
      hiddenPin: number;
      status: "approved"|"rejected"|"pending";
      rejectedMessage: string;
    };