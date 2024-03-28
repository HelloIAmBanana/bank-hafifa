import * as React from "react";
import AuthService from "../../AuthService";
import NavBar from "../../components/NavigationBar/NavBar";
import { useState, useContext, useEffect } from "react";
import { User } from "../../models/user";
import { Transaction } from "../../models/transactions";
import { generateUniqueId, updateUser } from "../../utils/utils";
import { errorAlert, successAlert } from "../../utils/swalAlerts";
import { UserContext } from "../../UserProvider";
import { UserTransactionDataGrid } from "../../components/UserTransactions";
import {
  Button,
  Grid,
  Paper,
  Typography,
  Modal,
  CircularProgress,
  Box,
} from "@mui/material";
import ajvErrors from "ajv-errors";
import Ajv, { JSONSchemaType } from "ajv";
import GenericForm from "../../components/GenericForm/GenericForm";
import CRUDLocalStorage from "../../CRUDLocalStorage";

const ajv = new Ajv({ allErrors: true, $data: true });
ajvErrors(ajv);

const fields = [
  {
    id: "receiverID",
    label: "Receiver ID",
    type: "text",
    required: false,
    placeholder: "Enter the desired account ID",
  },
  {
    id: "amount",
    label: "Amount",
    type: "number",
    required: false,
    placeholder: "Enter transaction amount",
  },
  {
    id: "reason",
    label: "Transaction Reason",
    type: "text",
    required: false,
    placeholder: "Enter transaction reason",
  },
];

const schema: JSONSchemaType<Transaction> = {
  type: "object",
  properties: {
    id: { type: "string" },
    senderID: { type: "string" },
    receiverID: { type: "string", minLength: 1 },
    reason: { type: "string", minLength: 1 },
    amount: { type: "number" },
    senderName: { type: "string" },
    receiverName: { type: "string" },
  },
  required: ["receiverID", "amount"],
  additionalProperties: true,
  errorMessage: {
    properties: {
      reason: "",
      receiverID: "",
      amount: "",
    },
  },
};
interface Row {
  id: string;
  senderID: string;
  receiverID: string;
  amount: string;
  reason: string;
}

const WelcomePage: React.FC = () => {
  const currentUser = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [isPaymentModalOpen, setPaymentModal] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);

  const updateBalance = async (user: User, amount: number) => {
    const updatedBalance = user.balance + amount;
    const updatedUser: User = {
      ...user,
      balance: updatedBalance,
    };
    await updateUser(updatedUser);
  };

  const openPaymentModal = () => {
    setPaymentModal(true);
  };

  const closePaymentModal = () => {
    setPaymentModal(false);
  };

  const createNewTransaction = async (data: any) => {
    const newTransaction = {
      ...data,
      senderID: currentUser?.id,
      id: generateUniqueId(),
      senderName: await AuthService.getUserFullNameByID(
        currentUser?.id as string
      ),
      receiverName: await AuthService.getUserFullNameByID(
        data.receiverID as string
      ),
    };
    const transactions = await CRUDLocalStorage.getAsyncData<Transaction[]>(
      "transactions"
    );
    const updatedTransactions = [...transactions, newTransaction];
    await CRUDLocalStorage.setAsyncData("transactions", updatedTransactions);
    fetchUserTransactions();
  };

  const handleSubmitTransaction = async (data: any) => {
    setIsLoading(true);
    const receivingUser = await AuthService.getUserFromStorage(data.receiverID);
    if (receivingUser != null) {
      await updateBalance(currentUser as User, -data.amount);
      await updateBalance(receivingUser as User, data.amount);
      setIsTableLoading(true);
      createNewTransaction(data);
      setIsLoading(false);
      successAlert(`Transfered ${data.amount}$ to ${receivingUser.firstName}`);
    } else {
      setIsLoading(false);
      errorAlert("Entered ID is WRONG");
    }
    closePaymentModal();
  };

  const fetchUserTransactions = async () => {
    try {
      const fetchedTransactions = await CRUDLocalStorage.getAsyncData<
        Transaction[]
      >("transactions");
      const modifiedTransactions = await Promise.all(
        fetchedTransactions.map(async (row) => {
          const senderName = await AuthService.getUserFullNameByID(
            row.senderID
          );
          const receiverName = await AuthService.getUserFullNameByID(
            row.receiverID
          );
          const styledAmount =
            row.senderID === currentUser?.id
              ? `-${row.amount}$`
              : `+${row.amount}$`;
          return {
            ...row,
            senderID: senderName,
            receiverID: receiverName,
            amount: styledAmount,
          };
        })
      );
      setRows(modifiedTransactions as Row[]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsTableLoading(false);
  };

  useEffect(() => {
    fetchUserTransactions();
  }, []);

  return (
    <Box mx={30} sx={{ paddingTop: 8 }}>
      <NavBar />
      {isLoading || !currentUser ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  padding: 2,
                  width: 250,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  backgroundColor: "#FAFBFF",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontFamily: "Poppins", fontWeight: "bold" }}
                >
                  Your Balance💰
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: "Poppins",
                    fontWeight: "bold",
                    marginTop: 2,
                    fontSize: 18,
                  }}
                >
                  {currentUser.balance}$
                </Typography>
                <Button onClick={openPaymentModal}>Make A Payment💸</Button>
              </Paper>
            </Grid>
          </Grid>
          {isTableLoading ? (
            <Box
              sx={{ display: "flex", justifyContent: "center", marginTop: 20 }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ font: "David" }} padding={3}>
              <Typography variant="h5" fontFamily={"Poppins"} padding={2}>
                Recent Transaction
              </Typography>
              {UserTransactionDataGrid(rows)}
            </Box>
          )}
        </Box>
      )}
      <Modal
        open={isPaymentModalOpen}
        onClose={closePaymentModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: 600,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography
            id="modal-title"
            variant="h6"
            component="h2"
            gutterBottom
            sx={{ fontFamily: "Poppins" }}
          >
            Create Transaction
          </Typography>
          <Grid item mx="auto" textAlign="center">
            <GenericForm
              fields={fields}
              onSubmit={handleSubmitTransaction}
              submitButtonLabel={
                isLoading ? <CircularProgress /> : "2 3 SHA-GER"
              }
              schema={schema}
            />
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
};

export default WelcomePage;
