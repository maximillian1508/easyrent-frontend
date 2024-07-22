import React from "react";
import { matchPath, useLocation } from "react-router-dom";

const useGetTitle = () => {
	const location = useLocation();

	const routes = [
		{ path: "/dashboard", title: "Dashboard" },
		{ path: "/profile", title: "Profile" },
		{ path: "/manage-users", title: "Manage Users" },
		{ path: "/manage-properties", title: "Manage Properties" },
		{ path: "/manage-properties/add", title: "Add Property" },
		{ path: "/manage-properties/edit/:id", title: "Edit Property" },
		{ path: "/manage-properties/details/:id", title: "Property Details" },
		{ path: "/manage-properties/applications/:id", title: "Property Details" },
	];

	for (const route of routes) {
		const match = matchPath(route.path, location.pathname);
		if (match) {
			console.log(match);
			return route.title;
		}
	}

	return "Dashboard"; // Default title
};

export default useGetTitle;
