import { LoaderFunction, defer } from "react-router-dom";
import CRUDLocalStorage from "../../CRUDLocalStorage";
import { Card } from "../../models/card";
import AuthService from "../../AuthService";

export type CardsLoaderData = {
  cards: Promise<Card[]>;
};

export const CardLoader: LoaderFunction = () => {
  const cards = (async () => {
    const currentUser = (await AuthService.getCurrentUser())!;
    const isAdmin = AuthService.isUserAdmin(currentUser);

    const fetchedCards = await CRUDLocalStorage.getAsyncData<Card[]>("cards");
    return isAdmin ? fetchedCards : fetchedCards.filter((card) => card.accountID === currentUser!.id);
  })();
  return defer({
    cards,
  } satisfies CardsLoaderData);
};
