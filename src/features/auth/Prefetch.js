import { useEffect } from "react";
import React from "react";
import { Outlet } from "react-router-dom";
import { store } from "../../app/store";
import { applicationsApiSlice } from "../applications/applicationsApiSlice";
import { complaintsApiSlice } from "../complaints/complaintsApiSlice";
import { contractsApiSlice } from "../contracts/contractsApiSlice";
import { propertiesApiSlice } from "../properties/propertiesApiSlice";
import { transactionsApiSlice } from "../transactions/transactionsApiSlice";
import { usersApiSlice } from "../users/usersApiSlice";

const Prefetch = () => {
	useEffect(() => {
		store.dispatch(
			usersApiSlice.util.prefetch("getUsers", "usersList", { force: true }),
		);
		store.dispatch(
			propertiesApiSlice.util.prefetch("getProperties", "propertiesList", {
				force: true,
			}),
		);
		store.dispatch(
			applicationsApiSlice.util.prefetch(
				"getApplications",
				"applicationsList",
				{
					force: true,
				},
			),
		);
		store.dispatch(
			contractsApiSlice.util.prefetch("getContracts", "contractsList", {
				force: true,
			}),
		);
		store.dispatch(
			transactionsApiSlice.util.prefetch(
				"getTransactions",
				"transactionsList",
				{
					force: true,
				},
			),
		);
		store.dispatch(
			complaintsApiSlice.util.prefetch("getComplaints", "complaintsList", {
				force: true,
			}),
		);
	}, []);

	return <Outlet />;
};

export default Prefetch;
