import React from "react";
import GenericForm from '../../components/GenericForm'

const TestForm: React.FC = () => {
  const fields = [
    { id: "email", label: "Email", type: "email", required: true, placeholder: "Enter your email", errorMsg: "Invalid email" },
    { id: "password", label: "Password", type: "password", required: true, placeholder: "Password", errorMsg: "Invalid password" },
    { id: "dafs", label: "lakgnas", type: "text", required: true, placeholder: "sakfkigdsfga", errorMsg: "Invalid password" },
  ];

  const onSubmit = (data: Record<string, any>) => {
    console.log("Form data:", data);
    // Handle form submission here
  };

  return (
    <div>
      <h2>Test Form</h2>
    </div>
  );
};

export default TestForm;
