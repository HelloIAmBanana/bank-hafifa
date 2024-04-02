import React from "react";
import { useForm } from "react-hook-form";
import { Box, MenuItem, Typography } from "@mui/material";
import Ajv, { Schema } from "ajv";
import Button from "@mui/material/Button";
import ajvErrors from "ajv-errors";
import fieldsRegistry from "../components/GenericForm/fieldsRegistry";
import { Field } from "../models/field";

const ajv = new Ajv({ allErrors: true, $data: true });

ajvErrors(ajv);

interface GenericFormProps {
  fields: Field[];
  onSubmit: (data: Record<string, any>) => void;
  submitButtonLabel: string | JSX.Element;
  schema: Schema;
}

const GenericForm: React.FC<GenericFormProps> = ({ fields, onSubmit, submitButtonLabel, schema }) => {
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
    <Box component="form" onSubmit={handleSubmit(internalHandleSubmit)} sx={{ mt: 1 }}>
      {fields.map((field) => {
        const FieldComponent = fieldsRegistry[field.type];
        return (
          <center>
            <Box>
              <Box key={field.id}>
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
                      width: "221px",
                      height: "46px",
                      marginTop: "20px",
                      borderStyle: "solid",
                      backgroundColor: "#FAFBFC",
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
                  <Typography fontSize={12} color={"red"} fontFamily={"Poppins"}>{customErrors[field.id]?.message}</Typography>

                </Box>
              </Box>
            </Box>
          </center>
        );
      })}

      <center>
        <Button
          onClick={onClick}
          type="submit"
          disabled={Boolean(typeof submitButtonLabel !== "string")}
          sx={{ width: 225, fontSize: 16, height:57}}
        >
          {submitButtonLabel}
        </Button>
      </center>
    </Box>
  );
};

export default GenericForm;
