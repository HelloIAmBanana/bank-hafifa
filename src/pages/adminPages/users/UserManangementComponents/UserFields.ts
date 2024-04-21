import { User } from "../../../../models/user";

 export const userFields=(user?:User)=>{
  return [
    {
      id: "firstName",
      label: "First Name",
      type: "text",
      placeholder: "Enter first name",
      initValue: !user?``: `${user.firstName}`,
    },
    {
      id: "lastName",
      label: "Last Name",
      type: "text",
      placeholder: "Enter last name",
      initValue: !user?``:`${user.lastName}`,
    },
    {
      id: "email",
      label: "Email",
      type: "text",
      placeholder: "Enter email",
      initValue: !user?``:`${user.email}`,
    },
    {
      id: "password",
      label: "Password",
      type: "text",
      placeholder: "Enter Password",
      initValue: !user?``:`${user.password}`,
    },
    {
      id: "birthDate",
      label: "Date Of Birth",
      type: "date",
      placeholder: "Enter birthday",
      initValue: !user?``:`${user.birthDate}`,
    },
    {
      id: "gender",
      label: "Gender",
      type: "select",
      options: [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
      ],
      initValue: !user?``: `${user.gender}`,
    },
    {
      id: "accountType",
      label: "Account Type",
      type: "select",
      options: [
        { value: "Personal", label: "Personal" },
        { value: "Business", label: "Business" },
      ],
      initValue: !user?``:`${user.accountType}`,
    },
    {
      id: "role",
      label: "Account Role",
      type: "select",
      options: [
        { value: "admin", label: "Admin" },
        { value: "customer", label: "Customer" },
      ],
      initValue: !user?``:`${user.role}`,
    },
    {
      id: "balance",
      label: "Balance",
      type: "number",
      initValue: !user?``:`${user.balance}`,

    },
    {
      id: "avatarUrl",
      label: "Profile Picture",
      type: "file",
    },
  ]
 }
