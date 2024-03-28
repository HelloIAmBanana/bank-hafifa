import { Navigate, Outlet } from "react-router-dom";
import AuthService from "./AuthService";
import React from 'react';
import UserProvider from "./UserProvider";

export const ProtectedRoutes = () => {
    let isAuthenticated = AuthService.isUserAuthenticated()
    return isAuthenticated ? (
        <UserProvider>
            <Outlet />
        </UserProvider>
    ) : (
        <Navigate to="/signin" />
    );
}
