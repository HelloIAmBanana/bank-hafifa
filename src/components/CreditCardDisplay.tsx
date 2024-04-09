import { Grid, Typography } from "@mui/material";
import { Card } from "../models/card";
import CreditCard from "./CreditCard";

interface CreditCardDisplayProps {
    cards: Card[];
    cancelAction?: (card:Card) => void;
    title: string;
}

const CreditCardDisplay: React.FC<CreditCardDisplayProps> = ({ cards, cancelAction, title }) => {
    const filteredCards = cards.filter((card) => card.status === title.toLowerCase());

    if (filteredCards.length > 0) {
        return (
            <Grid item xs={2} sm={4} md={8} xl={12} mt={2}>
                <Typography variant="h5" fontFamily="Poppins">
                    {title}
                </Typography>
                <Grid
                    sx={{
                        mt: 2,
                        overflowX: "auto",
                        display: "flex",
                        flexDirection: "row",
                        maxWidth: "100vh",
                        width: "auto",
                    }}
                >
                    {filteredCards.map((card, index) => (
                        <Grid item key={index} sx={{ marginRight: 2 }}>
                            <CreditCard
                                card={card}
                                isUserAdmin={false}
                                cancelCard={cancelAction}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        );
    } else {
        return null;
    }
}

export default CreditCardDisplay;
