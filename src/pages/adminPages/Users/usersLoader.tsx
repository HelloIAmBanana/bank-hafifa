import { LoaderFunction, defer } from "react-router-dom";
import CRUDLocalStorage from "../../../CRUDLocalStorage";
import { User } from "../../../models/user";

export type UsersLoaderData = {
  users: Promise<User[]>;
};

export const usersLoader: LoaderFunction = async () => {
  const users = CRUDLocalStorage.getAsyncData<User[]>("users");

  return defer({
    users,
  } satisfies UsersLoaderData);
};
