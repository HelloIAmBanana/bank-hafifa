import React, { useState, useMemo, useEffect } from "react";
import { User } from "../../models/user";
import { successAlert } from "../../utils/swalAlerts";
import { Grid, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import userStore from "../../UserStore";
import CRUDLocalStorage from "../../CRUDLocalStorage";
import * as _ from "lodash";
import GenericForm from "../../components/GenericForm/GenericForm";
import { JSONSchemaType } from "ajv";
import USD from "../../imgs/icons/currencies/USD.svg";
import ILS from "../../imgs/icons/currencies/ILS.svg";
import BTC from "../../imgs/icons/currencies/BTC.svg";
import EUR from "../../imgs/icons/currencies/EUR.svg";
import AED from "../../imgs/icons/currencies/AED.svg";
import JPY from "../../imgs/icons/currencies/JPY.svg";
import GBP from "../../imgs/icons/currencies/GBP.svg";

const getCurrencyIcon = (currency: string) => {
  switch (currency) {
    case "GBP":
      return GBP;
    case "ILS":
      return ILS;
    case "BTC":
      return BTC;
    case "EUR":
      return EUR;
    case "AED":
      return AED;
    case "JPY":
      return JPY;
    default:
      return USD;
  }
};

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
    currency: { type: "string" },
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

const currencyList = () => {
  const currencies = localStorage.getItem("currencies")!;
  const currencyObject = JSON.parse(currencies!);

  return Object.keys(currencyObject).map((key) => ({
    value: key,
    label: (
      <span>
        <img
          style={{ marginRight: 10, marginLeft: 10, marginTop: -4 }}
          width="30rem"
          height="30rem"
          src={`${getCurrencyIcon(key)}`}
          alt="Currency Icon"
        />
        <Typography sx={{ fontFamily: "Poppins", fontSize: "15px", fontWeight: "bold" }} marginLeft={10} marginTop={-4}>
          {key}
        </Typography>
      </span>
    ),
  }));
};

const ProfileSettingsPage: React.FC = observer(() => {
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
        id: "currency",
        label: "Currency",
        type: "select",
        initValue: `${user.currency}`,
        options: currencyList(),
      },
      {
        id: "avatarUrl",
        label: "Profile Picture",
        type: "file",
      },
    ];
  }, [user]);
  currencyList();
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
