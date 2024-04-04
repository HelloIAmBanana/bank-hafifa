import * as React from "react";
import AuthService from "../../AuthService";
import { useState, useContext, useEffect } from "react";
import { User } from "../../models/user";
import { Transaction } from "../../models/transactions";
import { DateTime } from "luxon";
import { generateUniqueId, updateUser } from "../../utils/utils";
import { errorAlert, successAlert } from "../../utils/swalAlerts";
import { UserContext } from "../../UserProvider";
import TransactionsTable from "../../components/UserTransactionsTable";
import { Button, Grid, Paper, Typography, Modal, CircularProgress, Box, Skeleton, useMediaQuery } from "@mui/material";
import ajvErrors from "ajv-errors";
import Ajv, { JSONSchemaType } from "ajv";
import CRUDLocalStorage from "../../CRUDLocalStorage";
import { TransactionRow } from "../../models/transactionRow";
import NavBar from "../../components/NavigationBar/NavBar";
import creditCard from "../../imgs/homeCreditCard.svg";
import GenericForm from "../../components/GenericForm/GenericForm";

const ajv = new Ajv({ allErrors: true, $data: true });
ajvErrors(ajv);

const fields = [
  {
    id: "receiverID",
    type: "text",
    placeholder: "Account ID",
  },
  {
    id: "amount",
    type: "number",
    placeholder: "Amount",
  },
  {
    id: "reason",
    type: "text",
    placeholder: "Reason",
  },
];

const schema: JSONSchemaType<Transaction> = {
  type: "object",
  properties: {
    id: { type: "string" },
    senderID: { type: "string" },
    receiverID: { type: "string", minLength: 1 },
    reason: { type: "string" },
    amount: { type: "string", minLength: 1 },
    senderName: { type: "string" },
    receiverName: { type: "string" },
    date: { type: "string" },
  },
  required: ["receiverID", "amount"],
  additionalProperties: false,
  errorMessage: {
    properties: {
      reason: "",
      receiverID: "Enter ID",
      amount: "Enter Amount",
    },
  },
};
const validateForm = ajv.compile(schema);

const WelcomePage: React.FC = () => {
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [isPaymentModalOpen, setPaymentModal] = useState(false);
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [userOldBalance, setUserOldBalance] = useState<number | undefined>();
  const isSmallScreen = useMediaQuery("(max-width:1200px)");

  const updateBalance = async (user: User, amount: number) => {
    const updatedBalance = user.balance + amount;
    const updatedUser: User = {
      ...user,
      balance: updatedBalance,
    };
    await updateUser(updatedUser);
    if (user.id === currentUser?.id) {
      setCurrentUser(updatedUser);
    }
  };

  const openPaymentModal = () => {
    setPaymentModal(true);
  };

  const closePaymentModal = async () => {
    if (isButtonLoading) return;
    setPaymentModal(false);
  };

  const createNewTransaction = async (data: any) => {
    const designatedUser = (await AuthService.getUserFromStorage(data.receiverID)) as User;
    const designatedUserName = AuthService.getUserFullName(designatedUser);

    const currentDateTime = new Date();

    const newTransaction = {
      ...data,
      amount: Number(data.amount),
      senderID: currentUser?.id,
      id: generateUniqueId(),
      senderName: AuthService.getUserFullName(currentUser as User),
      receiverName: designatedUserName,
      date: currentDateTime.toISOString(),
    };
    await CRUDLocalStorage.addItemToList<Transaction>("transactions", newTransaction);
  };

  const handleSubmitTransaction = async (data: any) => {
    setUserOldBalance(currentUser!.balance);
    if (!validateForm(data)) return;

    const amount = +data.amount;

    if (amount <= 0) {
      errorAlert("You can't enter a negative transaction amount!");
      closePaymentModal();
      return;
    }

    setIsButtonLoading(true);

    if (data.receiverID === currentUser!.id) {
      errorAlert("You can't enter your own ID!");
      setIsButtonLoading(false);
      closePaymentModal();
      return;
    }

    const receivingUser = await AuthService.getUserFromStorage(data.receiverID);
    if (!receivingUser) {
      errorAlert("Entered ID is WRONG");
      setIsButtonLoading(false);
      closePaymentModal();
      return;
    }
    await createNewTransaction(data);
    await updateBalance(receivingUser, amount);
    await updateBalance(currentUser!, -amount);

    successAlert(`Transferred ${amount}$ to ${receivingUser.firstName}`);

    setIsButtonLoading(false);
    closePaymentModal();
  };

  const fetchUserTransactions = async () => {
    setIsTableLoading(true);
    if (currentUser) {
      try {
        const fetchedTransactions = await CRUDLocalStorage.getAsyncData<Transaction[]>("transactions");
        const sortedTransactions =fetchedTransactions.sort((a,b)=>{
          return DateTime.fromISO(b.date).toMillis()-DateTime.fromISO(a.date).toMillis();
        })
        setTransactions(sortedTransactions);
        setIsTableLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };
  useEffect(() => {
    fetchUserTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  document.title = "Home";

  return (
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      <Grid xs={2} md={2} zIndex={2000} spacing={50}>
        <Box sx={{ backgroundColor: "white" }}>
          <NavBar />
        </Box>
      </Grid>
      {!currentUser ? (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Grid xs={8} md={8}>
            <center>
              <CircularProgress />
            </center>
          </Grid>
        </Box>
      ) : (
        <Grid xs={8} md={8} spacing={-5} zIndex={1200}>
          <Typography variant="h4" fontFamily={"Poppins"} fontWeight={"bold"} mx={-3}>
            Overview
          </Typography>
          <Grid container spacing={3} marginTop={0.5}>
            <Grid item xs={12} md={6} mx={-3} spacing={20}>
              <Paper
                sx={{
                  padding: 2,
                  width: 375,
                  height: 78,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  backgroundColor: "#f7f7ff",
                  borderRadius: 5,
                  borderColor: "#F50057",
                  borderStyle: "solid",
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ fontFamily: "Poppins", fontWeight: "bold" }}>
                  Your Balance💰
                </Typography>
                {isTableLoading ? (
                  <Skeleton width={150} height={100} />
                ) : (
                  <Typography
                    variant="h4"
                    sx={{
                      fontFamily: "Poppins",
                      fontWeight: "bold",
                      fontSize: 36,
                    }}
                  >
                    {!isButtonLoading ? `${currentUser.balance} $` : `${userOldBalance} $`}
                  </Typography>
                )}
              </Paper>

              <Button onClick={openPaymentModal} type="submit" sx={{ width: 415, borderRadius: 2 }}>
                Make A Payment💸
              </Button>
            </Grid>
            <Grid item spacing={50}>
              <Paper
                sx={{
                  padding: 2,
                  width: 375,
                  height: 78,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  backgroundColor: "#f7f7ff",
                  borderRadius: 5,
                  borderColor: "#F50057",
                  borderStyle: "solid",
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ fontFamily: "Poppins", fontWeight: "bold" }}>
                  Credit Limit🪙
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: "Poppins",
                    fontWeight: "bold",
                    fontSize: 36,
                  }}
                >
                  123,456 $
                </Typography>
              </Paper>
            </Grid>
            <Box marginTop={0.5}>
              <Typography variant="h6" fontWeight={"bold"} fontFamily={"Poppins"}>
                Transactions
              </Typography>
              <TransactionsTable transactions={transactions} isLoading={isTableLoading} userID={currentUser.id} />
            </Box>
          </Grid>
        </Grid>
      )}
      {currentUser && !isSmallScreen && (
        <Grid xs={2} md={2} zIndex={1200}>
          <Typography variant="h5" gutterBottom sx={{ fontFamily: "Poppins", fontWeight: "bold" }}>
            Wallet
          </Typography>
          <img src={creditCard} alt="Credit Card" />
          <Typography variant="h5" gutterBottom sx={{ fontFamily: "Poppins", fontWeight: "bold" }}>
            Quick Transfer
          </Typography>
          <Box sx={{ backgroundColor: "#D3E1F5", width: "253px", height: "325px", borderRadius: 5 }}>
            <GenericForm
              fields={fields}
              onSubmit={handleSubmitTransaction}
              schema={schema}
              isLoading={isButtonLoading && !isPaymentModalOpen}
              submitButtonLabel={"Send Money"}
            />
          </Box>
        </Grid>
      )}
      {currentUser && isSmallScreen && (
        <Grid marginLeft={25}>
          <Grid xs={4} md={8} zIndex={1200}>
            <Typography variant="h5" gutterBottom sx={{ fontFamily: "Poppins", fontWeight: "bold" }}>
              Quick Transfer
            </Typography>
            <Box sx={{ backgroundColor: "#D3E1F5", width: "253px", height: "325px", borderRadius: 5 }}>
              <GenericForm
                fields={fields}
                onSubmit={handleSubmitTransaction}
                schema={schema}
                isLoading={isButtonLoading && !isPaymentModalOpen}
                submitButtonLabel={"Send Money"}
              />
            </Box>
          </Grid>
        </Grid>
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
          <Typography id="modal-title" variant="h6" component="h2" gutterBottom sx={{ fontFamily: "Poppins" }}>
            New Transaction
          </Typography>
          <Grid item mx="auto">
            <GenericForm
              fields={fields}
              onSubmit={handleSubmitTransaction}
              schema={schema}
              isLoading={isButtonLoading && isPaymentModalOpen}
              submitButtonLabel={"2 3 SHA-GER"}
            />
          </Grid>
        </Box>
      </Modal>
    </Grid>
  );
};

export default WelcomePage;
