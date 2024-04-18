import { Grid, Typography } from "@mui/material";
import { Card } from "../../../models/card";
import CreditCard from "./CreditCard";

interface CreditCardsRowsProps {
  cards: Card[];
  title: string;
}

const CreditCardsRow: React.FC<CreditCardsRowsProps> = ({ cards, title }) => {
  if (cards.length > 0) {
    return (
      <Grid item xs={2} sm={4} md={8} xl={12} mt={2}>
        <Typography variant="h5" fontFamily="Poppins">
          {title}
        </Typography>
        <Grid
          sx={{
            mt: 2,
            overflowX: cards.length > 2 ? "auto" : "visible",
            display: "flex",
            flexDirection: "row",
            maxWidth: "100vh",
            width: "auto",
          }}
        >
          {cards.map((card, index) => (
            <Grid item key={index} ml={5}>
              <CreditCard card={card} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    );
  } else {
    return null;
  }
};

export default CreditCardsRow;
