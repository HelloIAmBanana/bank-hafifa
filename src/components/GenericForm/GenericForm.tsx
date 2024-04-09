import React from "react";
import { useForm } from "react-hook-form";
import { Box, CircularProgress, MenuItem, FormControl, FormHelperText, Button, Typography } from "@mui/material";
import Ajv, { Schema } from "ajv";
import ajvErrors from "ajv-errors";
import fieldsRegistry from "./fieldsRegistry";
import { Field } from "../../models/field";

const ajv = new Ajv({ allErrors: true, $data: true });
ajvErrors(ajv);

interface GenericFormProps {
  fields: Field[];
  onSubmit: (data: Record<string, any>) => void;
  submitButtonLabel: string;
  schema: Schema;
  isLoading: boolean;
}

const GenericForm: React.FC<GenericFormProps> = ({ fields, onSubmit, submitButtonLabel, schema, isLoading }) => {
  const validate = ajv.compile(schema);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const customErrors = errors as Record<string, { message: string }>;

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
    <Box component="form" onSubmit={handleSubmit(internalHandleSubmit)} sx={{ mt: 1 }}>
      {fields.map((field) => {
        const FieldComponent = fieldsRegistry[field.type];
        return (
          <Box>
            <Box key={field.id} marginTop="10px">
              <center>
                {field.label && (
                  <Typography variant="h6" sx={{ fontFamily: "Poppins" }}>
                    {field.label}
                  </Typography>
                )}
                <Box
                  sx={{
                    border: "hidden",
                    margin: "auto",
                    textAlign: "auto",
                  }}
                >
                  <Box>
                    <FormControl error={customErrors[field.id]?.message ? true : false} variant="standard">
                      <FieldComponent
                        {...field}
                        {...register(field.id)}
                        sx={{
                          width: "442",
                          height: "46px",
                          borderStyle: field.type === "checkbox" ? "hidden" : "solid",
                          backgroundColor: field.type === "checkbox" ? "hidden" : "#FAFBFC",
                          borderWidth: "0.5px",
                          borderRadius: "8px",
                          fontFamily: "Poppins",
                          padding: "20px",
                        }}
                        defaultValue={field?.initValue}
                      >
                        {field.options?.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </FieldComponent>
                      <FormHelperText>{customErrors[field.id]?.message}</FormHelperText>
                    </FormControl>
                  </Box>
                </Box>
              </center>
            </Box>
          </Box>
        );
      })}

      <center>
        <Button onClick={onClick} type="submit" disabled={isLoading} sx={{ width: "75%", marginBottom: "10px" }}>
          {isLoading ? (
            <CircularProgress size={17} thickness={20} sx={{ fontSize: 30, color: "white" }} />
          ) : (
            submitButtonLabel
          )}
        </Button>
      </center>
    </Box>
  );
};

export default GenericForm;
