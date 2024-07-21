import { useEffect } from "react";
import React from "react";
import { Outlet } from "react-router-dom";
import { store } from "../../app/store";
import { propertiesApiSlice } from "../properties/propertiesApiSlice";
import { usersApiSlice } from "../users/usersApiSlice";

const Prefetch = () => {
	useEffect(() => {
		store.dispatch(
			usersApiSlice.util.prefetch("getUsers", "usersList", { force: true }),
		);
		store.dispatch(
			usersApiSlice.util.prefetch("getProperties", "propertiesList", {
				force: true,
			}),
		);
	}, []);

	return <Outlet />;
};

export default Prefetch;
