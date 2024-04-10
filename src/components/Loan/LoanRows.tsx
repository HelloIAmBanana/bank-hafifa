import { Grid, Typography } from "@mui/material";
import { Loan } from "../../models/loan";
import LoansDisplay from "./LoanDisplay";

interface LoanRowsProps {
    loans: Loan[];
    payBackAction?: (card:Loan) => void;
    title: string;
    fetchAction?:()=>Promise<void>;
}

const LoanRow: React.FC<LoanRowsProps> = ({ loans, title ,fetchAction}) => {

    if (loans.length > 0) {
        return (
            <Grid item xs={2} sm={4} md={8} xl={12} mt={2}>
                <Typography variant="h5" fontFamily="Poppins">
                    {title}
                </Typography>
                <Grid
                    sx={{
                        mt: 2,
                        overflowX:loans.length>2?"auto":"visible",
                        display: "flex",
                        flexDirection: "row",
                        maxWidth: "100vh",
                        width: "auto",
                    }}
                >
                    {loans.map((loan, index) => (
                        <Grid item key={index} ml={5}>
                            <LoansDisplay loan={loan} fetchLoans={fetchAction}/>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        );
    } else {
        return null;
    }
}

export default LoanRow;
