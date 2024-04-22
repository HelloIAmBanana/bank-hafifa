import { Suspense, useContext, useEffect, useMemo, useState } from "react";
import { UserContext } from "../../UserProvider";
import { Box, Button, Container, Grid, Modal, Skeleton, Typography } from "@mui/material";
import { filterArrayByStatus, generateUniqueId, getUserFullName } from "../../utils/utils";
import GenericForm from "../../components/GenericForm/GenericForm";
import { Loan } from "../../models/loan";
import { errorAlert, successAlert } from "../../utils/swalAlerts";
import { JSONSchemaType } from "ajv";
import CRUDLocalStorage from "../../CRUDLocalStorage";
import LoansRow from "./Loan/LoansRow";
import AuthService from "../../AuthService";
import { Await, useLoaderData, useNavigate, useParams, useRevalidator } from "react-router-dom";
import { User } from "../../models/user";
import { GenericLoaderData } from "../../utils/genericLoader";

const schema: JSONSchemaType<Loan> = {
  type: "object",
  properties: {
    id: { type: "string" },
    loanOwner: { type: "string" },
    loanAmount: { type: "number", minimum: 1 },
    accountID: { type: "string" },
    interest: { type: "number" },
    paidBack: { type: "number" },
    status: { type: "string" },
    expireDate: { type: "string" },
  },
  required: ["loanAmount"],
  additionalProperties: true,
  errorMessage: {
    properties: {
      loanAmount: "Entered amount is less than 1",
    },
  },
};

const fields = [
  {
    id: "loanAmount",
    label: "Loan Amount",
    type: "number",
    placeholder: "Enter Loan Amount",
  },
];

const LoansPage: React.FC = () => {
  const [currentUser] = useContext(UserContext);
  const [isNewLoanModalOpen, setIsNewLoanModalOpen] = useState(false);
  const [isCreatingNewLoan, setIsCreatingNewLoan] = useState(false);

  const navigate = useNavigate();
  const { userID } = useParams();

  const data = useLoaderData() as GenericLoaderData<Loan>;
  const revalidator = useRevalidator();

  const loadingState = revalidator.state;

  const isLoading = Boolean(loadingState === "loading");

  const isSpectatedUserReal = async () => {
    if (userID) {
      const spectatedUser = await CRUDLocalStorage.getItemInList<User>("users", userID);
      if (!spectatedUser) {
        errorAlert("ID ISNT REAL");
        navigate("/admin/users");
        return;
      }
    }
  };

  const isAdmin = AuthService.isUserAdmin(currentUser);

  const handleLoanModalSubmit = async (data: any) => {
    const newLoan: Loan = {
      loanAmount: data.loanAmount,
      interest: 0,
      expireDate: "",
      accountID: currentUser!.id,
      id: generateUniqueId(),
      status: "pending",
      loanOwner: getUserFullName(currentUser!),
      paidBack: 0,
    };

    setIsCreatingNewLoan(true);
    await CRUDLocalStorage.addItemToList<Loan>("loans", newLoan);
    revalidator.revalidate();
    successAlert("Loan was created!");
    setIsCreatingNewLoan(false);
    closeLoanModal();
  };

  const openLoanModal = () => {
    setIsNewLoanModalOpen(true);
  };

  const closeLoanModal = () => {
    if (isCreatingNewLoan) return;
    setIsNewLoanModalOpen(false);
  };
  document.title = isAdmin ? "Manage Loans" : "Loans";

  useEffect(() => {
    isSpectatedUserReal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid container justifyContent="flex-start" sx={{ overflowX: "hidden" }}>
      <Box sx={{ ml: 15 }}>
        <Container sx={{ mt: 2 }}>
          <Grid container spacing={5}>
            <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
              <Grid container direction="row" justifyContent="space-between" alignItems="center" mt={5}>
                <Grid item xs={12} justifyContent="flex-start">
                  <Typography variant="h3" fontFamily="Poppins">
                    Loans
                  </Typography>
                </Grid>
                {!isAdmin && (
                  <Grid item xs={5} container justifyContent="flex-start">
                    <Button onClick={openLoanModal} type="submit" sx={{ width: "100%", borderRadius: 2, mb: 5 }}>
                      Request New Loan
                    </Button>
                  </Grid>
                )}
              </Grid>
              <Suspense
                fallback={
                  <Grid item xs={2} sm={4} md={8} xl={12} mt={2}>
                    <Skeleton height={"12rem"} width={window.innerWidth / 2} />
                  </Grid>
                }
              >
                <Await resolve={data.items} errorElement={<p>Error loading loans!</p>}>
                  {(loans) =>
                    isLoading ? (
                      isAdmin && !userID ? (
                        <Skeleton>
                          <LoansRow loans={filterArrayByStatus(loans, "pending", userID)} title="Pending" />
                        </Skeleton>
                      ) : (
                        <Box>
                          <Skeleton sx={{ transform: "translate(0,0)" }}>
                            <LoansRow loans={filterArrayByStatus(loans, "approved", userID)} title="Approved" />
                          </Skeleton>
                          <Skeleton sx={{ transform: "translate(0,0)" }}>
                            <LoansRow loans={filterArrayByStatus(loans, "offered", userID)} title="Offered" />
                          </Skeleton>
                          <Skeleton sx={{ transform: "translate(0,0)" }}>
                            <LoansRow loans={filterArrayByStatus(loans, "rejected", userID)} title="Rejected" />
                          </Skeleton>
                        </Box>
                      )
                    ) : isAdmin && !userID ? (
                      <LoansRow loans={filterArrayByStatus(loans, "pending", userID)} title="Pending" />
                    ) : (
                      <Box>
                        <LoansRow loans={filterArrayByStatus(loans, "approved", userID)} title="Approved" />
                        <LoansRow loans={filterArrayByStatus(loans, "offered", userID)} title="Offered" />
                        <LoansRow loans={filterArrayByStatus(loans, "rejected", userID)} title="Rejected" />
                      </Box>
                    )
                  }
                </Await>
              </Suspense>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Modal
        open={isNewLoanModalOpen}
        onClose={closeLoanModal}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: 400,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
          }}
        >
          <center>
            <GenericForm
              fields={fields}
              onSubmit={handleLoanModalSubmit}
              submitButtonLabel={"Request Loan"}
              schema={schema}
              isLoading={isCreatingNewLoan}
            />
          </center>
        </Box>
      </Modal>
    </Grid>
  );
};

export default LoansPage;
