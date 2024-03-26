import { Navigate, Outlet } from "react-router-dom";
import AuthService from "./AuthService";
import React from 'react';

export const ProtectedRoutes = () => {
    let isAuthinticated = AuthService.isUserAuthinticated()
    return(
        isAuthinticated ? <Outlet /> : <Navigate to="/signin" />
    )
}
