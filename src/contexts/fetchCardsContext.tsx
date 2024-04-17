import React, { createContext, useContext, useMemo, useState } from "react";
import { UserContext } from "../UserProvider";
import CRUDLocalStorage from "../CRUDLocalStorage";
import AuthService from "../AuthService";
import { Card } from "../models/card";

type FetchCardsContextType = {
  fetchCards: () => Promise<void>;
  isLoading: boolean;
  cards: Card[];
};

const FetchCardsContext = createContext<FetchCardsContextType>({
  fetchCards: () => Promise.resolve(),
  isLoading: false,
  cards: [],
});

export function FetchCardsProvider({ children }: React.PropsWithChildren) {
  const [currentUser] = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [cards, setCards] = useState<Card[]>([]);

  const isAdmin = useMemo(() => {
    return AuthService.isUserAdmin(currentUser);
  }, [currentUser]);

  const fetchCards = async () => {
    setIsLoading(true);
    try {
      const fetchedCards = await CRUDLocalStorage.getAsyncData<Card[]>("cards");
      const currentCards = isAdmin ? fetchedCards : fetchedCards.filter((card) => card.accountID === currentUser!.id);
      setCards(currentCards);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  return (
    <FetchCardsContext.Provider
      value={{
        fetchCards: fetchCards,
        isLoading: isLoading,
        cards: cards,
      }}
    >
      {children}
    </FetchCardsContext.Provider>
  );
}

export const useFetchCardsContext = () => useContext(FetchCardsContext);
