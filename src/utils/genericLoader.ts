import { LoaderFunction, defer } from "react-router-dom";
import CRUDLocalStorage from "../CRUDLocalStorage";
import AuthService from "../AuthService";

export type GenericLoaderData<T> = {
  items: Promise<T[]>;
};

export const genericLoader = <T extends { accountID: string }>(localStorageKey: string): LoaderFunction => {
  const loaderFunc: LoaderFunction = async() => {
    const items = (async () => {
      const currentUser = (await AuthService.getCurrentUser())!;
      const isAdmin = AuthService.isUserAdmin(currentUser);

      const fetchedItems = await CRUDLocalStorage.getAsyncData<T[]>(localStorageKey);
      return isAdmin ? fetchedItems : fetchedItems.filter((item) => item.accountID === currentUser!.id);
    })();
    return defer({
      items,
    } satisfies GenericLoaderData<T>);
  };

  return loaderFunc;
};
