export type User = {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  password: string;
  avatarUrl: string;
  gender: "Male" | "Female";
  accountType: "Business" | "Personal";
  role: "customer" | "admin";
  balance: number;
  currency: string;
};
