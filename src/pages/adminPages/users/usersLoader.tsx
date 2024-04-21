import { LoaderFunction, defer } from "react-router-dom";
import CRUDLocalStorage from "../../../CRUDLocalStorage";
import { User } from "../../../models/user";

export type UsersLoaderData = {
  users: Promise<User[]>;
};

export const userLoader: LoaderFunction = () => {
  const users = (async () => {

    const fetchedUsers = await CRUDLocalStorage.getAsyncData<User[]>("users");
    return fetchedUsers;

  })();
  return defer({
    users,
  } satisfies UsersLoaderData);
};
