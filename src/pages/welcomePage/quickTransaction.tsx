import { Box, Typography } from "@mui/material";
import { Fragment } from "react/jsx-runtime";
import GenericForm from "../../components/GenericForm/GenericForm";
import { Schema } from "ajv";

interface QuickTransactionProps {
    fields:{ id: string; type: string; placeholder: string; }[];
    handleSubmitTransaction:(data: any) => Promise<void>;
    schema: Schema;
    isLoading:boolean
}
 
const QuickTransaction: React.FC<QuickTransactionProps> = ({fields,handleSubmitTransaction,schema,isLoading}) => {
    return (
        <Fragment>
          <Typography variant="h5" gutterBottom sx={{ fontFamily: "Poppins", fontWeight: "bold" }}>
            Quick Transaction
          </Typography>
          <Box sx={{ backgroundColor: "#D3E1F5", borderRadius: 5,height:"150",borderColor:"#808080",borderStyle:"solid"}}>
            <GenericForm
              fields={fields}
              onSubmit={handleSubmitTransaction}
              schema={schema}
              isLoading={isLoading}
              submitButtonLabel={"Send Money"}
            />
          </Box>
        </Fragment>
    );
}
 
export default QuickTransaction;