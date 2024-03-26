import { Navigate, Outlet } from "react-router-dom";
import AuthService from "./AuthService";
import React from 'react';

export const ProtectedRoutes = () => {
    let isAuthenticated = AuthService.isUserAuthenticated()
    return(
        isAuthenticated ? <Outlet /> : <Navigate to="/signin" />
    )
}
