import React, { createContext, useContext, useMemo } from "react";
import { UserContext } from "../UserProvider";
import CRUDLocalStorage from "../CRUDLocalStorage";
import AuthService from "../AuthService";
import { Card } from "../models/card";
import { useQuery } from "react-query";

type FetchCardsContextType = {
  isLoading: boolean;
  cards: Card[];
};

const FetchCardsContext = createContext<FetchCardsContextType>({
  isLoading: false,
  cards: [],
});

export function FetchCardsProvider({ children }: React.PropsWithChildren) {
  const [currentUser] = useContext(UserContext);

  const isAdmin = useMemo(() => {
    return AuthService.isUserAdmin(currentUser);
  }, [currentUser]);

  const { isLoading, data: cards = [] } = useQuery(["cards", isAdmin, currentUser], async () => {
    const fetchedCards = await CRUDLocalStorage.getAsyncData<Card[]>("cards");
    return isAdmin ? fetchedCards : fetchedCards.filter((card) => card.accountID === currentUser!.id);
  });

  return <FetchCardsContext.Provider value={{ isLoading, cards }}>{children}</FetchCardsContext.Provider>;
}
export const useFetchCardsContext = () => useContext(FetchCardsContext);
