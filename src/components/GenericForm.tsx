import React from "react";
import { useForm } from "react-hook-form";
import { Box, MenuItem } from "@mui/material";
import FormHelperText from "@mui/material/FormHelperText";
import Ajv, { Schema } from "ajv";
import Button from "@mui/material/Button";
import ajvErrors from "ajv-errors";
import { Typography } from "@mui/material";
import fieldsRegistry from "./models/fieldTypes";

const ajv = new Ajv({ allErrors: true, $data: true });

ajvErrors(ajv);

interface Field {
  id: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  errorMsg?: string;
  checked?: boolean; // Add checked property for checkbox fields

  options?: { value: string; label: string }[];
}

interface GenericFormProps {
  fields: Field[];
  onSubmit: (data: Record<string, any>) => void;
  submitButtonLabel: string;
  schema: Schema;
}

const GenericForm: React.FC<GenericFormProps> = ({
  fields,
  onSubmit,
  submitButtonLabel,
  schema,
}) => {
  const validate = ajv.compile(schema);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const customErrors = errors as Record<string, { message?: string }>;

  const onClick = () => {
    clearErrors();
  };

  const validateForm = (data: Record<string, any>) => {
    validate(data);
    const formErrors = validate.errors;
    formErrors?.forEach((currentError) => {
      setError(currentError.instancePath.substring(1), {
        message: currentError.message,
      });
    });
  };

  const internalHandleSubmit = async (data: Record<string, any>) => {
    validateForm(data);
    onSubmit(data);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(internalHandleSubmit)}
      sx={{ mt: 1 }}
    >
      {fields.map((field) => (
        <Box key={field.id}>
          <Typography
            variant="h6"
            className="signinLabelNormal"
            sx={{ fontFamily: "Poppins" }}
          >
            {field.label}
          </Typography>
          <Box
            className="formLabel"
            sx={{
              width: "auto",
              border: "hidden",
              margin: "auto",
              textAlign: "auto",
            }}
          >
            {React.createElement(fieldsRegistry[field.type], {
              type: field.type, // Pass undefined for type if it's a checkbox field
              sx: { fontFamily: "Poppins", width: 260 },
              id: field.id,
              ...register(field.id),
              required: field.required,
              placeholder: field.placeholder,
              checked: field.checked, // Pass checked prop for checkbox fields

              children: field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              )),
            })}
          </Box>
          <FormHelperText
            id="component-error-text"
            style={{ color: "red", fontFamily: "Poppins", alignItems:"center" }}
          >
            {customErrors[field.id]?.message}
          </FormHelperText>
        </Box>
      ))}
      <center>
        <Button onClick={onClick} type="submit">
          {submitButtonLabel}
        </Button>
      </center>
    </Box>
  );
};

export default GenericForm;
