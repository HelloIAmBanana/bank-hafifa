import { Box, Typography, Container, Grid, Paper, Modal, Skeleton, Button } from "@mui/material";
import AuthService from "../../AuthService";
import { User } from "../../models/user";
import { Transaction } from "../../models/transactions";
import { createNewNotification, generateUniqueId, getUserFullName } from "../../utils/utils";
import CRUDLocalStorage from "../../CRUDLocalStorage";
import { useContext, useEffect, useMemo, useState } from "react";
import { UserContext } from "../../UserProvider";
import { errorAlert, successAlert } from "../../utils/swalAlerts";
import { JSONSchemaType } from "ajv";
import GenericForm from "../../components/GenericForm/GenericForm";
import TransactionsTable from "./UserTransactionsTable";
import { useNavigate } from "react-router-dom";
import { useFetchTransactionsContext } from "../../contexts/fetchTransactionsContext";
import NewsBox from "./NewsBox";
import getArticles from "./GetArticles";
import OverviewPanel from "./OverviewPanel";

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
    amount: { type: "number", minimum: 1 },
    senderName: { type: "string" },
    receiverName: { type: "string" },
    date: { type: "string" },
  },
  required: ["receiverID", "amount"],
  additionalProperties: false,
  errorMessage: {
    properties: {
      receiverID: "Please enter ID",
      amount: "Please enter an amount larger than 0",
    },
  },
};

const Home: React.FC = () => {
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isArticlesLoading, setIsArticlesLoading] = useState(true);
  const [articles, setArticles] = useState<any[]>([]);
  const { fetchTransactions, isLoading, transactions } = useFetchTransactionsContext();
  const [isPaymentModalOpen, setPaymentModal] = useState(false);
  const [userOldBalance, setUserOldBalance] = useState<number | undefined>();
  const navigate = useNavigate();

  const isAdmin = useMemo(() => {
    return AuthService.isUserAdmin(currentUser);
  }, [currentUser]);

  const storeArticles = async () => {
    setIsArticlesLoading(true);
    const articles = await getArticles(2);
    setArticles(articles);
    setIsArticlesLoading(false);
  };

  const updateBalance = async (user: User, amount: number) => {
    const updatedBalance = user.balance + amount;
    const updatedUser: User = {
      ...user,
      balance: updatedBalance,
    };

    await CRUDLocalStorage.updateItemInList<User>("users", updatedUser);
    if (user.id === currentUser!.id) {
      setCurrentUser(updatedUser);
    }
  };

  const openPaymentModal = () => {
    if (isButtonLoading) return;
    setPaymentModal(true);
  };

  const closePaymentModal = async () => {
    if (isButtonLoading) return;
    setPaymentModal(false);
  };

  const createNewTransaction = async (data: any) => {
    const designatedUser = await CRUDLocalStorage.getItemInList<User>("users", data.receiverID);
    const designatedUserName = getUserFullName(designatedUser!);

    const currentDateTime = new Date().toISOString();

    const newTransaction = {
      ...data,
      senderID: currentUser!.id,
      id: generateUniqueId(),
      senderName: getUserFullName(currentUser!),
      receiverName: designatedUserName,
      date: currentDateTime,
    };

    await createNewNotification(data.receiverID, "newTransaction");
    await CRUDLocalStorage.addItemToList<Transaction>("transactions", newTransaction);
  };

  const handleSubmitTransaction = async (data: any) => {
    setUserOldBalance(currentUser!.balance);

    const amount = data.amount;

    if (data.receiverID === currentUser!.id) {
      errorAlert("You can't enter your own ID!");
      closePaymentModal();
      return;
    }

    setIsButtonLoading(true);

    const receivingUser = await CRUDLocalStorage.getItemInList<User>("users", data.receiverID);

    if (!receivingUser) {
      errorAlert("Entered ID is WRONG");
      setIsButtonLoading(false);
      closePaymentModal();
      return;
    }

    await createNewTransaction(data);
    await updateBalance(receivingUser, amount);
    await updateBalance(currentUser!, -amount);

    successAlert(`Transferred $${amount} to ${receivingUser.firstName}`);

    setIsButtonLoading(false);
    closePaymentModal();
  };

  useEffect(() => {
    fetchTransactions();
    storeArticles();
    // eslint-disable-next-line
  }, [currentUser]);

  document.title = "Home";
  return (
    <Box sx={{ display: "flex" }}>
      <Container sx={{ mt: 3 }}>
        {isAdmin ? (
          <Grid container direction="column" justifyContent="center" alignItems="center" minHeight="100vh" mt={-10}>
            <Grid container direction="column" justifyContent="center" alignItems="center" ml={1}>
              <Grid item>
                <Typography variant="h5" gutterBottom sx={{ fontFamily: "Poppins", fontWeight: "bold" }}>
                  Welcome Back Admin {getUserFullName(currentUser!)}
                </Typography>
              </Grid>
              <Grid item>
                <Button type="submit" onClick={() => navigate("/admin/loans")}>
                  Loan Control
                </Button>
              </Grid>
              <Grid item>
                <Button type="submit" onClick={() => navigate("/admin/cards")}>
                  Card Control
                </Button>
              </Grid>
              <Grid item>
                <Button type="submit" onClick={() => navigate("/admin/users")}>
                  User Control
                </Button>
              </Grid>
              <Grid item>
                <Button type="submit" onClick={() => navigate("/admin/deposits")}>
                  Deposit Control
                </Button>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={20}>
            {/* Overview Panel */}
            <Grid item xs={8} md={8} lg={8}>
              <Paper
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
                elevation={0}
              >
                <OverviewPanel
                  isTableLoading={isLoading}
                  userOldBalance={userOldBalance}
                  isButtonLoading={isButtonLoading}
                  openPaymentModal={openPaymentModal}
                />
              </Paper>
            </Grid>
            {/* Quick Transaction */}
            <Grid item xs={4} md={4} lg={4} order={{ xs: 4, md: 4, lg: 2 }}>
              <Typography variant="h5" gutterBottom sx={{ fontFamily: "Poppins", fontWeight: "bold" }}>
                Quick Transaction
              </Typography>
              <Paper
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 5,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "#D3E1F5",
                    borderRadius: 5,
                    height: "150",
                    borderColor: "#808080",
                  }}
                >
                  <GenericForm
                    fields={fields}
                    onSubmit={handleSubmitTransaction}
                    schema={schema}
                    isLoading={isButtonLoading && !isPaymentModalOpen}
                    submitButtonLabel="Send Money"
                  />
                </Box>
              </Paper>
            </Grid>
            {/* Transactions Table*/}
            <Grid item xs={12} md={9} lg={12} order={{ xs: 2, md: 2, lg: 3 }} mt={-20}>
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }} elevation={0}>
                <Typography variant="h4" gutterBottom fontWeight={"bold"} fontFamily={"Poppins"}>
                  Transactions
                </Typography>
                {isLoading ? (
                  <Skeleton height={350} />
                ) : (
                  <TransactionsTable transactions={transactions} userID={currentUser!.id} />
                )}
              </Paper>
            </Grid>
            {/* Articles */}
            <Grid item xs={12} md={12} lg={9} order={{ xs: 3, md: 3, lg: 4 }} mt={-20}>
              <Grid
                sx={{
                  overflowX: "auto",
                  width: window.screen.width-800,
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                {isArticlesLoading ? (
                  <Skeleton height={350} width={750} />
                ) : (
                  articles.map((article, index) => (
                    <Grid item key={index} ml={5}>
                      <NewsBox
                        articleDescription={article.description}
                        articleLink={article.url}
                        articleTitle={article.title}
                      />
                    </Grid>
                  ))
                )}
              </Grid>
            </Grid>
          </Grid>
        )}
      </Container>

      <Modal
        open={isPaymentModalOpen}
        onClose={closePaymentModal}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: 360,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 5,
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontFamily: "Poppins" }}>
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
    </Box>
  );
};
export default Home;