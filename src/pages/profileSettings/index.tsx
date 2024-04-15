import React, { useState, useContext, useMemo } from "react";
import { User } from "../../models/user";
import { successAlert } from "../../utils/swalAlerts";
import Ajv, { JSONSchemaType } from "ajv";
import ajvErrors from "ajv-errors";
import { Grid } from "@mui/material";
import { UserContext } from "../../UserProvider";
import CRUDLocalStorage from "../../CRUDLocalStorage";
import * as _ from "lodash";
import GenericForm from "../../components/GenericForm/GenericForm";

const ajv = new Ajv({ allErrors: true, $data: true });
ajvErrors(ajv);

const schema: JSONSchemaType<User> = {
  type: "object",
  properties: {
    id: { type: "string" },
    firstName: { type: "string", minLength: 1 },
    lastName: { type: "string", minLength: 1 },
    email: { type: "string", pattern: "[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$" },
    password: { type: "string", minLength: 6 },
    birthDate: { type: "string", minLength: 1 },
    avatarUrl: { type: "string" },
    gender: { type: "string", enum: ["Male", "Female"], minLength: 1 },
    accountType: { type: "string", enum: ["Business", "Personal"] },
    role: { type: "string", enum: ["admin", "customer"] },
    balance: { type: "number" },
  },
  required: [],
  additionalProperties: true,
  errorMessage: {
    properties: {
      firstName: "Enter Your First Name",
      lastName: "Enter Your Last Name",
      birthDate: "Enter Your Birthdate",
      gender: "Please Select Your Gender",
    },
  },
};

const validateForm = ajv.compile(schema);

const ProfileSettingsPage: React.FC = () => {
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [isFormLoading, setIsFormLoading] = useState(false);

  const fields = useMemo(() => {
    return [
      {
        id: "firstName",
        label: "First Name",
        type: "text",
        initValue: `${currentUser?.firstName}`,
      },
      {
        id: "lastName",
        label: "Last Name",
        type: "text",
        initValue: `${currentUser?.lastName}`,
      },
      {
        id: "birthDate",
        label: "Date Of Birth",
        type: "date",
        initValue: `${currentUser?.birthDate}`,
      },
      {
        id: "gender",
        label: "Gender",
        type: "select",
        initValue: `${currentUser?.gender}`,
        options: [
          { value: "Male", label: "Male" },
          { value: "Female", label: "Female" },
        ],
      },
      {
        id: "avatarUrl",
        label: "Profile Picture",
        type: "file",
      },
    ];
  }, [currentUser]);


  const handleSubmitProfileInfo = async (data: any) => {
    setIsFormLoading(true);
    if (validateForm(data)) {
      const updatedUser: User = {
        ...currentUser!,
        ...data,
      };
      if (!_.isEqual(updatedUser, currentUser)) {
        await CRUDLocalStorage.updateItemInList<User>("users", updatedUser);
        setCurrentUser(updatedUser);
        successAlert(`Updated User!`);
      }
    }
    setIsFormLoading(false);
  };

  document.title = "Account Settings";

  return (
      <Grid container direction="column" justifyContent="flex-start" alignItems="center" marginTop={5} mr={15}>
          <GenericForm
            fields={fields}
            onSubmit={handleSubmitProfileInfo}
            submitButtonLabel="Update"
            schema={schema}
            isLoading={isFormLoading}
          />
      </Grid>
  );
};

export default ProfileSettingsPage;
