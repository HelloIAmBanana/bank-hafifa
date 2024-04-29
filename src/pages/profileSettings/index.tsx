import React, { useState, useMemo, useEffect } from "react";
import { User } from "../../models/user";
import { successAlert } from "../../utils/swalAlerts";
import { Grid } from "@mui/material";
import { observer } from "mobx-react-lite";
import userStore from "../../UserStore";
import CRUDLocalStorage from "../../CRUDLocalStorage";
import * as _ from "lodash";
import GenericForm from "../../components/GenericForm/GenericForm";
import { JSONSchemaType } from "ajv";

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

const ProfileSettingsPage: React.FC =  observer(() => {
  const [isFormLoading, setIsFormLoading] = useState(false);
  const user = userStore.currentUser!;

  const fields = useMemo(() => {
    return [
      {
        id: "firstName",
        label: "First Name",
        type: "text",
        initValue: `${user.firstName}`,
      },
      {
        id: "lastName",
        label: "Last Name",
        type: "text",
        initValue: `${user.lastName}`,
      },
      {
        id: "birthDate",
        label: "Date Of Birth",
        type: "date",
        initValue: `${user.birthDate}`,
      },
      {
        id: "gender",
        label: "Gender",
        type: "select",
        initValue: `${user.gender}`,
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
  }, [user]);

  const handleSubmitProfileInfo = async (data: any) => {
    setIsFormLoading(true);
    const updatedUser: User = {
      ...user!,
      ...data,
    };
    if (!_.isEqual(updatedUser, user)) {
      await CRUDLocalStorage.updateItemInList<User>("users", updatedUser);
      userStore.currentUser = updatedUser;
      successAlert(`Updated User!`);
    }
    setIsFormLoading(false);
  };

  document.title = "Account Settings";

  useEffect(() => {
    userStore.storeCurrentUser();
  }, []);

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
});

export default ProfileSettingsPage;
