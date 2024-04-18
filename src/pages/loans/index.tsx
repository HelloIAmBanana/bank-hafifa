import { useContext, useEffect, useMemo, useState } from "react";
import { UserContext } from "../../UserProvider";
import { Box, Button, Container, Grid, Modal, Skeleton, Typography } from "@mui/material";
import { generateUniqueId, getUserFullName } from "../../utils/utils";
import GenericForm from "../../components/GenericForm/GenericForm";
import { Loan } from "../../models/loan";
import { errorAlert, successAlert } from "../../utils/swalAlerts";
import { JSONSchemaType } from "ajv";
import CRUDLocalStorage from "../../CRUDLocalStorage";
import LoansRow from "./LoanComponents/LoansRow";
import { useFetchLoanContext } from "../../contexts/fetchLoansContext";
import AuthService from "../../AuthService";
import { useNavigate, useParams } from "react-router-dom";
import { User } from "../../models/user";

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
  const { isLoading, loans } = useFetchLoanContext();

  const navigate = useNavigate();

  const { userID } = useParams();

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

  const pendingLoans = useMemo(() => {
    const pendingLoans = loans.filter((loan) => loan.status === "pending");
    return userID ? pendingLoans.filter((loan) => loan.accountID === userID) : pendingLoans;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loans]);

  const approvedLoans = useMemo(() => {
    const approvedLoans = loans.filter((loan) => loan.status === "approved");
    return userID ? approvedLoans.filter((loan) => loan.accountID === userID) : approvedLoans;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loans]);

  const offeredLoans = useMemo(() => {
    const offeredLoans = loans.filter((loan) => loan.status === "offered");
    return userID ? offeredLoans.filter((loan) => loan.accountID === userID) : offeredLoans;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loans]);

  const rejectedLoans = useMemo(() => {
    const rejectedLoans = loans.filter((loan) => loan.status === "rejected");
    return userID ? rejectedLoans.filter((loan) => loan.accountID === userID) : rejectedLoans;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loans]);

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
    successAlert("Loan was created!");
    closeLoanModal();
    setIsCreatingNewLoan(false);
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

              {isLoading ? (
                <Grid item xs={2} sm={4} md={8} xl={12} mt={2}>
                  <Skeleton height={"12rem"} width={window.innerWidth / 2} />
                </Grid>
              ) : isAdmin && !userID ? (
                <LoansRow loans={pendingLoans} title="Pending" />
              ) : (
                <Box>
                  <LoansRow loans={approvedLoans} title="Approved" />
                  <LoansRow loans={offeredLoans} title="Offered" />
                  <LoansRow loans={rejectedLoans} title="Rejected" />
                </Box>
              )}
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
