import React from "react";
import useAuth from "../../hooks/useAuth";
import AdminDashboard from "./AdminDashboard";
import CustomerDashboard from "./CustomerDashboard";

const Dashboard = () => {
	const { isCustomer, isAdmin } = useAuth();

	let content;

	if (isCustomer) {
		content = <CustomerDashboard />;
	} else if (isAdmin) {
		content = <AdminDashboard />;
	}

	return content;
};

export default Dashboard;
