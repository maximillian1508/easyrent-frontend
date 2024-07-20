import React from "react";
import { useLocation } from "react-router-dom";

const useGetTitle = () => {
	let title = "Dashboard";
	const location = useLocation();
	switch (location.pathname) {
		case "/dashboard":
			title = "Dashboard";
			return title;
		case "/manage-users":
			title = "Manage Users";
			return title;
		default:
			return "Dashboard"; // Default title
	}
};

export default useGetTitle;
