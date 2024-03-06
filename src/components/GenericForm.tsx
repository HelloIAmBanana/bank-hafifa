import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Box } from "@mui/material";
import FormHelperText from "@mui/material/FormHelperText";
import Ajv, { JSONSchemaType, Schema } from "ajv";
import ajvErrors from "ajv-errors";

const ajv = new Ajv({ allErrors: true });
require("ajv-errors")(ajv);

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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  const onChange = () => {
    setCurrentLabelStyle("signinLabelNormal");
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
          <h4>{field.label}</h4>
          {field.type !== "select" ? (
          <input
            type={field.type}
            id={field.id}
            {...register(field.id)}
            required={field.required}
            onChange={handleInputChange}
            placeholder={
              currentLabelStyle === "signinLabelNormal"
                ? field.placeholder
                : "Incorrect Credentials"
            }
            style={{
              borderColor:
                currentLabelStyle === "signinLabelNormal"
                  ? "#181818"
                  : "#d10000",
            }}
          />
          ):(
          <select
          id={field.id}
          {...register(field.id)}
          required={field.required}
          style={{
            borderColor:
              currentLabelStyle === "signinLabelNormal"
                ? "#181818"
                : "#d10000",
          }}
          >
            {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}

        </select>)}
          <FormHelperText
            id="component-error-text"
            hidden={field.errorMsgVisibility}
            style={{ color: "red" }}
          >
            {field.errorMsg}
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
