import { jwtDecode } from "jwt-decode";
import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";

const useAuth = () => {
	const token = useSelector(selectCurrentToken);
	let isCustomer = false;
	let isAdmin = false;

	if (token) {
		const decoded = jwtDecode(token);
		const { userId, userType, userName } = decoded.UserInfo;
		if (userType === "customer") {
			isCustomer = true;
		} else if (userType === "admin") {
			isAdmin = true;
		}

		return { userId, userType, userName, isCustomer, isAdmin };
	}

	return { userId: "", userType: "", userName: "", isCustomer, isAdmin };
};

export default useAuth;
