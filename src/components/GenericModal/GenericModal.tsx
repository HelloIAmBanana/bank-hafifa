import React from "react";
import { useForm } from "react-hook-form";
import { Box, MenuItem,Typography,Button,FormHelperText} from "@mui/material";
import Ajv, { JSONSchemaType } from "ajv";
import ajvErrors from "ajv-errors";
import fieldsRegistry from "../../models/fieldTypes";
import { User } from "../../models/user";
import { useState } from "react";

import "./style.css";

const ajv = new Ajv({ allErrors: true, $data: true });

ajvErrors(ajv);
const schema: JSONSchemaType<User> = {
  type: "object",
  properties: {
    id: { type: "string" },
    firstName: { type: "string", minLength: 1 },
    lastName: { type: "string", minLength: 1 },
    hobbies: { type: "array", items: { type: "string" } },
    email: { type: "string", pattern: "[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$" },
    password: { type: "string", minLength: 6 },
    birthDate: { type: "string", minLength: 1 },
    avatarUrl: { type: "string" },
    gender: { type: "string", enum: ["Male", "Female"],minLength: 1 },
    accountType: { type: "string", enum: ["Business", "Personal"] },
    role: { type: "string", enum: ["admin", "customer"] },
    balance: { type: "number"},
  },
  required: [],
  additionalProperties: true,
  errorMessage: {
    properties: {
      email: "Entered Email Is Invalid.",
      password: "Entered Password Is Less Than 6 Characters.",
      firstName: "Enter Your First Name",
      lastName: "Enter Your Last Name",
      birthDate: "Enter Your Birthdate",
      gender: "Please Select Your Gender",
    },
  },
};
interface Field {
  id: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  checked?: boolean;
  options?: { value: string; label: string }[];
}

interface GenericModalProps {
  fields: Field[];
  onSubmit: (data: Record<string, any>) => void;
  submitButtonLabel: string;
}

const GenericModal: React.FC<GenericModalProps> = ({
  fields,
  onSubmit,
  submitButtonLabel,
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
  const [isNotChanged, setIsNotChanged] = useState(true);

  const onClick = () => {
    clearErrors();
  };

  const validateModal = (data: Record<string, any>) => {
    validate(data);
    const formErrors = validate.errors;
    formErrors?.forEach((currentError) => {
      setError(currentError.instancePath.substring(1), {
        message: currentError.message,
      });
    });
  };

  const internalHandleSubmit = async (data: Record<string, any>) => {
    validateModal(data);
    if(validate(data)){
      onSubmit(data);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsNotChanged(false)
  }


  return (
    <Box
      component="form"
      onSubmit={handleSubmit(internalHandleSubmit)}
      sx={{
        width: 400,
        bgcolor: "background.paper",
        p: 4,
        borderRadius: 2,
        mt:1,
      }}
    >
      {fields.map((field) => {
        const FieldComponent = fieldsRegistry[field.type];
        return (
          <Box key={field.id}>
            <Typography
              variant="h6"
              className="secondTitle"
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
              <FieldComponent
                {...field}
                {...register(field.id)}
                sx={{ fontFamily: "Poppins", width: 260 }}
                defaultValue={field.placeholder}
                onChange={handleChange}
              >
                {field.options?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </FieldComponent>
            </Box>
            <FormHelperText
              id="component-error-text"
              style={{
                color: "red",
                fontFamily: "Poppins",
                alignItems: "center",
              }}
            >
              {customErrors[field.id]?.message}
            </FormHelperText>
          </Box>
        );
      })}
      <center>
        <Button onClick={onClick} type="submit" >
          {submitButtonLabel}
        </Button>
      </center>
    </Box>
  );
};

export default GenericModal;
