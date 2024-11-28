import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequireAuth = ({ allowedTypes }) => {
	const location = useLocation();
	const { userType } = useAuth();

	useEffect(() => {
		
	});

	const content = allowedTypes.includes(userType) ? (
		<Outlet />
	) : (
		<Navigate to="/login" state={{ from: location }} replace />
	);

	return content;
};

export default RequireAuth;
