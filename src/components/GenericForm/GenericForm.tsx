import React from "react";
import { useForm } from "react-hook-form";
import { Box, CircularProgress, Grid, MenuItem } from "@mui/material";
import FormHelperText from "@mui/material/FormHelperText";
import Ajv, { Schema } from "ajv";
import Button from "@mui/material/Button";
import ajvErrors from "ajv-errors";
import { Typography } from "@mui/material";
import { useState } from "react";
import fieldsRegistry from "./fieldsRegistry";
const ajv = new Ajv({ allErrors: true, $data: true });

ajvErrors(ajv);

interface Field {
  id: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  checked?: boolean;
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
  const [isLoading,setIsLoading]= useState(false);
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
    setIsLoading(true)
    clearErrors();
    setIsLoading(false)

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
      {fields.map((field) => {
        const FieldComponent = fieldsRegistry[field.type];
        return (
          <Box>
            <Box key={field.id}>
              <Typography variant="h6" sx={{ fontFamily: "Poppins" }}>
                {field.label}
              </Typography>
              <Box
                sx={{
                  border: "hidden",
                  margin: "auto",
                  textAlign: "auto",
                }}
              >
                <FieldComponent
                  {...field}
                  {...register(field.id)}
                  sx={{
                    fontFamily: "Poppins",
                    
                  }}
                  disabled={isLoading}
                >
                  {field.options?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </FieldComponent>
              </Box>
            </Box>
            <Grid>
              <FormHelperText
                sx={{
                  mx: 45,
                  color: "red",
                  fontFamily: "Poppins",
                }}
              >
                {customErrors[field.id]?.message}
              </FormHelperText>
            </Grid>
          </Box>
        );
      })}

      <center>
        <Button onClick={onClick} type="submit" disabled={isLoading}>
        {isLoading ? <CircularProgress /> : submitButtonLabel}
        </Button>
      </center>
    </Box>
  );
};

export default GenericForm;
