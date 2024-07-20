import React from "react";
import useAuth from "../../hooks/useAuth";

const Dashboard = () => {
	const { isCustomer, isAdmin } = useAuth();

	let content;

	if (isCustomer) {
		content = <h1>Customer Dashboard</h1>;
	} else if (isAdmin) {
		content = <h1>Admin Dashboard</h1>;
	}

	return content;
};

export default Dashboard;
