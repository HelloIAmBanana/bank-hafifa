const signupFormFields = [
    {
      id: "firstName",
      label: "First Name",
      type: "text",
      placeholder: "Enter your first name",
    },
    {
      id: "lastName",
      label: "Last Name",
      type: "text",
      placeholder: "Enter your last name",
    },
    {
      id: "email",
      label: "Email",
      type: "text",
      placeholder: "Enter your email",
    },
    {
      id: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter a password",
    },
    {
      id: "birthDate",
      label: "Date Of Birth",
      type: "date",
      placeholder: "Enter your birthday",
    },
    {
      id: "gender",
      label: "Gender",
      type: "select",
      options: [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
      ],
    },
    {
      id: "accountType",
      label: "Account Type",
      type: "select",
      options: [
        { value: "Personal", label: "Personal" },
        { value: "Business", label: "Business" },
      ],
    },
  ];
  export default signupFormFields;