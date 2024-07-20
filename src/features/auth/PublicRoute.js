import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { USERTYPE } from "../../config/UserType";
import useAuth from "../../hooks/useAuth";

const PublicRoute = () => {
	const { userType } = useAuth();
	return !userType || userType === USERTYPE.CUSTOMER ? (
		<Outlet />
	) : (
		<Navigate to="/dashboard" />
	);
};

export default PublicRoute;
