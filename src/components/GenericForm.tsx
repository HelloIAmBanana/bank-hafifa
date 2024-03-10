import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Box, MenuItem, Typography } from "@mui/material";
import FormHelperText from "@mui/material/FormHelperText";
import Ajv, { Schema } from "ajv";
import Button, { ButtonProps } from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import ajvErrors from "ajv-errors";
import { ContactPageSharp } from "@mui/icons-material";
import fieldsRegistry from "./models/fieldTypes";
const ajv = new Ajv({ allErrors: true, $data: true });

ajvErrors(ajv);

const generateUniqueId = () => {
  return "_" + Math.random().toString(36).substring(2, 9);
};

const CustomButton = styled(Button)<ButtonProps>(({ theme }) => ({
  width: "100%",
  borderRadius: "50px",
  fontFamily: "Poppins",
  letterSpacing: "0.4em",
  fontSize: "25px",
  fontWeight: "bold",
  backgroundColor: "#f50057",
  color: "white",
  "&:hover": {
    backgroundColor: "#d6044e",
  },
}));

interface Field {
  id: string;
  label: string;
  type: string;
  required: boolean;
  placeholder: string;
  errorMsg: string;
  errorMsgVisibility: boolean;
  options?: { value: string; label: string }[]; // For select fields
}

interface Props {
  fields: Field[];
  customSubmitFunction: (data: Record<string, any>) => void;
  submitButtonName: string;
  schema: Schema;
}

const GenericForm: React.FC<Props> = ({
  fields,
  customSubmitFunction,
  submitButtonName,
  schema,
}) => {
  const [formData, setFormData] = useState<Record<string, string | undefined>>(
    {}
  );
  const [fieldsData, setFieldsData] = useState(fields);
  const [currentLabelStyle, setCurrentLabelStyle] =
    useState("signinLabelNormal");
  const validate = ajv.compile(schema);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const customErrors = errors as Record<string, { message?: string }>;
  const onChange = () => {
    clearErrors();
  };

  const validateForm = (data: Record<string, any>) => {
    fields.map((field) => (field.errorMsgVisibility = true)); //Reset Error Messages
    validate(data);
    const errorMessages = Array.isArray(validate.errors) ? validate.errors : []; //Get all the errors
    fields.map((field /*Go throu every field*/) =>
      errorMessages.map(
        (
          message //Go throu every error
        ) =>
          message.instancePath.substring(1) == field.id //check if it is assign to the field id
            ? (field.errorMsgVisibility = false) //if they match, show the error
            : console.log()
      )
    );
    setFieldsData(fields);
  };

  const onSubmit = async (data: Record<string, any>) => {
    validateForm(data);
    customSubmitFunction(data);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ mt: 1 }}
      onChange={onChange}
    >
      {fieldsData.map((field) => (
        <Box key={field.id}>
          <Typography variant="h6" className="signinLabelNormal">{field.label}</Typography>
          <div className="formLabel">
            {React.createElement(fieldsRegistry[field.type], {
              type: field.type,
              id: field.id,
              ...register(field.id),
              required: field.required,
              placeholder: field.placeholder,
              children: field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              )),
            })}
          </div>
          <FormHelperText id="component-error-text" style={{ color: "red" }}>
            {customErrors[field.id]?.message}
          </FormHelperText>
        </Box>
      ))}
      <center><button
        type="submit"
        style={{ width: "100%", borderRadius: "50px", fontFamily: "Poppins", letterSpacing:"0.4em", fontSize:"25px", fontWeight:"bold"}}
      >
        {submitButtonName}
      </button></center> 
    </Box>
  );
};

export default GenericForm;
