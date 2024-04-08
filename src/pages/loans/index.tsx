import { useContext, useEffect, useMemo, useState } from "react";
import { UserContext } from "../../UserProvider";
import NavBar from "../../components/NavigationBar/NavBar";
import { Box, Button, Grid, Modal, Skeleton, Typography } from "@mui/material";
import { generateUniqueId } from "../../utils/utils";
import { PacmanLoader } from "react-spinners";
import LoansDisplay from "../../components/LoanDisplay";
import GenericForm from "../../components/GenericForm/GenericForm";
import AuthService from "../../AuthService";
import { Loan } from "../../models/loan";
import { errorAlert, successAlert } from "../../utils/swalAlerts";
import ajvErrors from "ajv-errors";
import Ajv, { JSONSchemaType } from "ajv";
import CRUDLocalStorage from "../../CRUDLocalStorage";

const ajv = new Ajv({ allErrors: true, $data: true });
ajvErrors(ajv);

const schema: JSONSchemaType<Loan> = {
  type: "object",
  properties: {
    id: { type: "string" },
    loanAmount: { type: "string" },
    accountID: { type: "string" },
    interest: { type: "string" },
    paidBack: { type: "number" },
    status: { type: "string" },
    expireDate: { type: "string" },
    rejectedMessage: { type: "string" },
  },
  required: ["accountID", "loanAmount", "interest"],
  additionalProperties: true,
  errorMessage: {
    properties: {
      accountID: "Enter Account ID",
    },
  },
};

const validateForm = ajv.compile(schema);

const LoansPage: React.FC = () => {
  const [currentUser] = useContext(UserContext);
  const [isNewLoanModalOpen, setIsNewLoanModalOpen] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [loans, setLoans] = useState<Loan[]>();
  const [isLoansLoading, setIsLoanLoading] = useState(true);

  const fetchUserLoans = async () => {
    if (currentUser) {
      setIsLoanLoading(true);
      try {
        const fetchedLoans = await CRUDLocalStorage.getAsyncData<Loan[]>("loans");
        const userLoans = fetchedLoans.filter((currentLoan) => currentLoan.accountID === currentUser.id);
        const modifiedLoans = userLoans.map((userLoan) => {
          return {
            ...userLoan,
            expireDate: userLoan.expireDate.replaceAll("-", "/"),
          };
        });
        setLoans(modifiedLoans);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setIsLoanLoading(false);
    }
  };

  const fields = useMemo(() => {
    return [
      {
        id: "accountID",
        label: "Account ID",
        type: "text",
        placeholder: "Enter Account ID",
        initValue: `${currentUser?.id}`,
      },
      {
        id: "loanAmount",
        label: "Loan Amount",
        type: "number",
        placeholder: "Enter Loan Amount",
      },
      {
        id: "interest",
        label: "interest Amount",
        type: "number",
        placeholder: "Enter interest Amount",
      },
      {
        id: "expireDate",
        label: "Enter Expire Date",
        type: "date",
      },
    ];
  }, [currentUser]);

  const handleLoanModalSubmit = async (data: any) => {
    setIsButtonLoading(true);

    const loanRequester = await AuthService.getUserFromStorage(data.accountID);
    if (loanRequester) {
      const newLoan: Loan = {
        ...data,
        id: generateUniqueId(),
        status: "Appending",
        paidBack: 0,
        rejectedMessage: "",
      };
      if (validateForm(newLoan)) {
        await CRUDLocalStorage.addItemToList<Loan>("loans", newLoan);
        successAlert("Loan was created!");
        closeLoanModal();
        fetchUserLoans();
      }
    } else {
      errorAlert("USER DOES NOT EXIST!");
      closeLoanModal();
    }
    setIsButtonLoading(false);
  };

  const openLoanModal = () => {
    setIsNewLoanModalOpen(true);
  };

  const closeLoanModal = () => {
    setIsNewLoanModalOpen(false);
  };

  document.title = "Loans";

  useEffect(() => {
    fetchUserLoans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  return !currentUser ? (
    <Grid container direction="column" justifyContent="flex-end" alignItems="center" marginTop={45}>
      <PacmanLoader color="#ffe500" size={50} />
    </Grid>
  ) : (
    <Box sx={{ display: "flex", backgroundColor: "white", boxShadow: 16 }}>
      <NavBar />
      <Box sx={{ flexGrow: 1 }}>
        <Grid container direction="row" justifyContent="center" alignItems="center">
          <Button onClick={openLoanModal}>New Loan</Button>

          <Grid item xs={12} md={12} xl={12} ml={16}>
            <Typography variant="h3" fontFamily="Poppins" mt={5}>
              Loans
            </Typography>
          </Grid>
          {isLoansLoading ? (
            <Skeleton height={700} width={1400} />
          ) : (
            loans!.map((loan, index) => (
              <Grid item xs={12} sm={6} md={6} lg={4} xl={2} key={index} ml={5} mt={5}>
                <LoansDisplay loan={loan} />
              </Grid>
            ))
          )}
        </Grid>
      </Box>
      <Modal
        id="LoanModal"
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
              submitButtonLabel={"Create Card"}
              schema={schema}
              isLoading={isButtonLoading}
            ></GenericForm>
          </center>
        </Box>
      </Modal>
    </Box>
  );
};

export default LoansPage;
