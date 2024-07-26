import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "../../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
	baseUrl: "http://localhost/api",
	credentials: "include",
	prepareHeaders: (headers, { getState }) => {
		const token = getState().auth.token;
		console.log("token", token);
		if (token) {
			headers.set("Authorization", `Bearer ${token}`);
		}
		return headers;
	},
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
	//args: request url, body, method
	//api: signal, dispatch, getState, and context
	//extraOptions: options for fetch custom like (shout: true)
	let result = await baseQuery(args, api, extraOptions);
	if (result?.error?.status === 403) {
		console.log("Sending refresh token");

		// send refresh token to get new access token
		const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);
		if (refreshResult?.data) {
			//store the new access token
			api.dispatch(setCredentials({ ...refreshResult.data }));

			// retry the original request with the new access token
			result = await baseQuery(args, api, extraOptions);
		} else {
			if (refreshResult?.error?.status === 403) {
				refreshResult.error.data.message =
					"Your login session has expired. Please login again. ";
			}
			return refreshResult;
		}
	}
	return result;
};

export const apiSlice = createApi({
	//in dev: localhost/api
	baseQuery: baseQueryWithReauth,
	tagTypes: [
		"User",
		"Property",
		"Application",
		"Contract",
		"Transaction",
		"Complaint",
	], //tags used to cache data
	endpoints: (builder) => ({}), //empty builder to provide extended slices
});
