import React from "react";
import { useForm } from "react-hook-form";
import { Box } from "@mui/material";
import FormHelperText from "@mui/material/FormHelperText";
import Ajv, { Schema } from "ajv";

import Button, { ButtonProps } from "@mui/material/Button";
import { styled } from "@mui/material/styles";

import ajvErrors from "ajv-errors";

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
  customSubmitAction: (data: Record<string, any>) => void;
  submitButtonName: string;
  schema: Schema;
}

const GenericForm: React.FC<Props> = ({
  fields,
  customSubmitAction,
  submitButtonName,
  schema,
}) => {
  const validate = ajv.compile(schema);

  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<Record<string, any>>();

  const customErrors = errors as Record<string, { message?: string }>;
  
    const onChange = () => {
      clearErrors();
    };

  const validateForm = (data: Record<string, any>) => {
    fields.map((field) => (field.errorMsgVisibility = true)); //Reset Error Messages
    validate(data);
    const errorMessages = Array.isArray(validate.errors) ? validate.errors : []; //Get all the errors
    errorMessages.forEach((currentError) => {
      // Go throuh each error
      setError(currentError.instancePath.substring(1), {
        type: "custom",
        message: `${currentError.message?.toString()}`,
      });
    });
    return errorMessages.length > 0 ? false : true;
  };

  const onSubmit = async (data: Record<string, any>) => {
    data.avatarUrl =
      data.avatarUrl === undefined
        ? "https://icon-library.com/images/no-user-image-icon/no-user-image-icon-26.jpg"
        : data.avatarUrl;
    data.id = data.id === undefined ? generateUniqueId() : data.id;
    console.log(validateForm(data));
    if (validateForm(data)) {
      customSubmitAction(data);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ mt: 1 }}
      onChange={onChange}
    >
      {fields.map((field) => (
        <Box key={field.id}>
          <h4>{field.label}</h4>
          {field.type !== "select" ? (
            <input
              type={field.type}
              id={field.id}
              {...register(field.id)}
              required={field.required}
              placeholder={field.placeholder}
              style={{ borderColor: "#181818" }}
            />
          ) : (
            <select
              id={field.id}
              {...register(field.id)}
              required={field.required}
              style={{ borderColor: "#181818" }}
            >
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
          <FormHelperText id="component-error-text" style={{ color: "red" }}>
            {customErrors[field.id]?.message}
          </FormHelperText>
        </Box>
      ))}
      <CustomButton type="submit">{submitButtonName}</CustomButton>
    </Box>
  );
};

export default GenericForm;
