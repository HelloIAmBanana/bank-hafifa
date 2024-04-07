import { useContext, useMemo, useState } from "react";
import { UserContext } from "../../UserProvider";
import NavBar from "../../components/NavigationBar/NavBar";
import { Box, Button, Container, Grid, Modal } from "@mui/material";
import { generateUniqueId, getUserFullName } from "../../utils/utils";
import { PacmanLoader } from "react-spinners";
import LoansDisplay from "../../components/Loan";
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
    loanAmount: { type: "number" },
    accountID: { type: "string" },
    interest: { type: "string" },
    paidBack: { type: "number" },
    status: { type: "string" },
    rejectedMessage: { type: "string" },
  },
  required: ["accountID", "loanAmount", "interest"],
  additionalProperties: true,
  errorMessage: {
    properties: {
      accountID: "Enter Account ID",
      loanAmount: "",
    },
  },
};

const validateForm = ajv.compile(schema);

const LoansPage: React.FC = () => {
  
  const [currentUser] = useContext(UserContext);
  const [isNewLoanModalOpen, setIsNewLoanModalOpen] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

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
        id: "intrest",
        label: "Intrest Amount",
        type: "number",
        placeholder: "Enter Intrest Amount",
      },
    ];
  }, [currentUser]);

  const handleLoanModalSubmit = async (data: any) => {
    setIsButtonLoading(true)

    const loanRequester = await AuthService.getUserFromStorage(data.accountID);
    if (loanRequester) {
      const newLoan: Loan = {
        ...data,
        loanAmount: +data.loanAmount,
        id: generateUniqueId(),
        status: "Appending",
        rejectedMessage: "",
      };
      if (validateForm(newLoan)) {
        await CRUDLocalStorage.addItemToList<Loan>("loans", newLoan);
        successAlert("Card was created!");
        closeLoanModal();
      }
    } else {
      errorAlert("USER DOES NOT EXIST!");
      closeLoanModal();
    }
    setIsButtonLoading(false)
  };

  const openLoanModal = () => {
    setIsNewLoanModalOpen(true);
  };

  const closeLoanModal = () => {
    setIsNewLoanModalOpen(false);
  };

  document.title = "Loans";

  return !currentUser ? (
    <Grid container direction="column" justifyContent="flex-end" alignItems="center" marginTop={45}>
      <PacmanLoader color="#ffe500" size={50} />
    </Grid>
  ) : (
    <Box sx={{ display: "flex", backgroundColor: "white", boxShadow: 16 }}>
      <NavBar />
      <Box component="main" sx={{ flexGrow: 0 }}>
        <Button onClick={openLoanModal}>New Loan</Button>
        <Container sx={{ mt: 2 }}>
          <Grid container spacing={5}>
            <Grid item>{getUserFullName(currentUser)} <LoansDisplay/></Grid>
            
          </Grid>
        </Container>
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
