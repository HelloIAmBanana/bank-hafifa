export type Field = {
  id: string;
  type: string;
  label?: string;
  placeholder?: string;
  checked?: boolean;
  options?: { value: string; label: string }[];
  initValue?: string;
};
export type TransactionRow = {
  id: string;
  senderID: string;
  receiverID: string;
  amount: string;
  reason: string;
  date: string;
};
export type Transaction = {
  id: string;
  senderID: string;
  receiverID: string;
  reason: string;
  amount: string;
  senderName: string;
  receiverName: string;
  date: string;
};
export type User = {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  hobbies: string[];
  email: string;
  password: string;
  avatarUrl: string;
  gender: string;
  accountType: string;
  role: string;
  balance: number;
};
