import { useContext, useEffect, useMemo, useState } from "react";
import { UserContext } from "../../UserProvider";
import { Box, Button, Container, Grid, Modal, Skeleton, Typography } from "@mui/material";
import { generateUniqueId, getUserFullName } from "../../utils/utils";
import GenericForm from "../../components/GenericForm/GenericForm";
import { Loan } from "../../models/loan";
import { successAlert } from "../../utils/swalAlerts";
import ajvErrors from "ajv-errors";
import Ajv, { JSONSchemaType } from "ajv";
import CRUDLocalStorage from "../../CRUDLocalStorage";
import LoanRow from "../../components/Loan/LoanRows";

const ajv = new Ajv({ allErrors: true, $data: true });
ajvErrors(ajv);

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

const validateForm = ajv.compile(schema);

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
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoansLoading, setIsLoanLoading] = useState(true);

  const fetchUserLoans = async () => {
    setIsLoanLoading(true);
    try {
      const fetchedLoans = await CRUDLocalStorage.getAsyncData<Loan[]>("loans");
      const userLoans = fetchedLoans.filter((currentLoan) => currentLoan.accountID === currentUser!.id);
      setLoans(userLoans);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoanLoading(false);
  };

  const pendingLoans = useMemo(() => {
    return loans.filter((loan) => loan.status === "pending");
  }, [loans]);

  const approvedLoans = useMemo(() => {
    return loans.filter((loan) => loan.status === "approved");
  }, [loans]);

  const offeredLoans = useMemo(() => {
    return loans.filter((loan) => loan.status === "offered");
  }, [loans]);

  const rejectedLoans = useMemo(() => {
    return loans.filter((loan) => loan.status === "rejected");
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

    if (!validateForm(newLoan)) return;
    
    setIsCreatingNewLoan(true);
    await CRUDLocalStorage.addItemToList<Loan>("loans", newLoan);
    successAlert("Loan was created!");
    closeLoanModal();
    await fetchUserLoans();
    setIsCreatingNewLoan(false);
  };

  const openLoanModal = () => {
    setIsNewLoanModalOpen(true);
  };

  const closeLoanModal = () => {
    if(isCreatingNewLoan) return;
    setIsNewLoanModalOpen(false);
  };

  document.title = "Loans";

  useEffect(() => {
    fetchUserLoans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  return (
    <Grid container justifyContent="flex-start">
      <Box component="main" sx={{ flexGrow: 0, ml: 15 }}>
        <Container sx={{ mt: 2 }}>
          <Grid container spacing={5}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
                <Grid container direction="row" justifyContent="space-between" alignItems="center" mt={5}>
                  <Grid item xs={12} justifyContent="flex-start">
                    <Typography variant="h3" fontFamily="Poppins">
                      Loans
                    </Typography>
                  </Grid>
                  <Grid item xs={5} container justifyContent="flex-start">
                    <Button onClick={openLoanModal} type="submit" sx={{ width: "100%", borderRadius: 2, mb: 5 }}>
                      Request New Loan
                    </Button>
                  </Grid>
                </Grid>

                {isLoansLoading ? (
                  <Grid item xs={2} sm={4} md={8} xl={12} mt={2}>
                    <Skeleton height={"12rem"} width={window.innerWidth / 2} />
                  </Grid>
                ) : (
                  <Box>
                    <LoanRow loans={approvedLoans} title="Approved" fetchAction={fetchUserLoans} />
                    <LoanRow loans={offeredLoans} title="Offered" fetchAction={fetchUserLoans} />
                    <LoanRow loans={pendingLoans} title="Pending" fetchAction={fetchUserLoans} />
                    <LoanRow loans={rejectedLoans} title="Rejected" fetchAction={fetchUserLoans} />
                  </Box>
                )}
              </Grid>
            </Box>
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
