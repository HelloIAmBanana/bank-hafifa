import { Grid, Typography } from "@mui/material";
import { Card } from "../../../models/card";
import CreditCard from "./CreditCard";

interface CreditCardsRowsProps {
  cards: Card[];
  title: string;
}

const CreditCardsRow: React.FC<CreditCardsRowsProps> = ({ cards, title }) => {
  return (
    <Grid item xs={12} sm={12} md={12} xl={12} mt={4}>
      <Typography variant="h4" fontFamily="Poppins">
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
        {cards.length > 0 ? (
          cards.map((card, index) => (
            <Grid item key={index} mr={2}>
              <CreditCard card={card} />
            </Grid>
          ))
        ) : (
          <Typography variant="h6" fontFamily="Poppins" gutterBottom mb={5}>
            There Aren't Any {title} Cards
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default CreditCardsRow;
