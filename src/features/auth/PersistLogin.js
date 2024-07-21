import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Outlet, useLocation } from "react-router-dom";
import usePersist from "../../hooks/usePersist";
import { useRefreshMutation } from "./authApiSlice";
import { selectCurrentToken } from "./authSlice";

const PersistLogin = () => {
	const publicRoutes = [
		"/",
		"/faq",
		"/about-us",
		"/login",
		"/register",
		"/email-verification",
		"/listing",
	];

	const [persist] = usePersist();
	const token = useSelector(selectCurrentToken);
	const effectRan = useRef(false);
	const [trueSuccess, setTrueSuccess] = useState(false);
	const location = useLocation();

	const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
		useRefreshMutation();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (effectRan.current === true || process.env.NODE_ENV !== "development") {
			const verifyRefreshToken = async () => {
				console.log("verifying refresh token");
				try {
					await refresh();
					setTrueSuccess(true);
				} catch (err) {
					console.log(err);
				}
			};
			if (!token && persist) verifyRefreshToken();
		}

		// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
		return () => (effectRan.current = true);
	}, []);

	let content;

	if (publicRoutes.includes(location.pathname)) {
		//persist: no
		console.log("public route");
		content = <Outlet />;
	} else if (!persist) {
		//persist: no
		console.log("no persist");
		content = <Outlet />;
	} else if (isLoading) {
		// persist: yes, token: no
		console.log("loading");
		content = <p>Loading...</p>;
	} else if (isError) {
		// persist: yes, token: no
		console.log(error);
		content = (
			<p>
				{error.data?.message} <Link to="/login">Please Login Again</Link>
			</p>
		);
	} else if (isSuccess && trueSuccess) {
		//persist: yes, token: yes
		console.log("success");
		content = <Outlet />;
	} else if (token && isUninitialized) {
		//persist: yes, token: yes
		console.log("token & uninit");
		console.log(isUninitialized);
		content = <Outlet />;
	}

	return content;
};

export default PersistLogin;
