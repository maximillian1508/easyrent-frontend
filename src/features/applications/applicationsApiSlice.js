import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const applicationsAdapter = createEntityAdapter({});

const initialState = applicationsAdapter.getInitialState({});

export const applicationsApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getApplications: builder.query({
			query: () => "/applications",
			validateStatus: (response, result) => {
				return response.status === 200 && !result.isError;
			},
			transformResponse: (responseData) => {
				// get response from the query
				const loadedApplications = responseData.applications.map(
					(application) => {
						application.id = application._id;

						return application;
					},
				);
				return applicationsAdapter.setAll(initialState, loadedApplications);
			},
			providesTags: (result, error, arg) => {
				if (result?.ids) {
					return [
						{ type: "Application", id: "LIST" },
						...result.ids.map((id) => ({ type: "Application", id })),
					];
				}
				return [{ type: "Application", id: "LIST" }];
			},
		}),
		addNewApplication: builder.mutation({
			query: (initialApplicationData) => ({
				url: "/applications",
				method: "POST",
				body: { ...initialApplicationData },
			}),
			invalidatesTags: [{ type: "Application", id: "LIST" }],
		}),
		updateApplication: builder.mutation({
			query: (initialApplicationData) => ({
				url: `/applications/${initialApplicationData.id}`,
				method: "PATCH",
				body: { ...initialApplicationData },
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: "Application", id: arg.id },
			],
		}),
		deleteApplication: builder.mutation({
			query: (initialApplicationData) => ({
				url: `/applications/${initialApplicationData.id}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: "Application", id: arg.id },
			],
		}),
		getUserRentalStatus: builder.query({
			query: (userId) => `/applications/user-rental-status/${userId}`,
		}),
	}),
});

export const {
	useGetApplicationsQuery,
	useAddNewApplicationMutation,
	useUpdateApplicationMutation,
	useDeleteApplicationMutation,
	useGetUserRentalStatusQuery,
} = applicationsApiSlice;

// returns query result object
export const selectApplicationsResult =
	applicationsApiSlice.endpoints.getApplications.select();

//creates a memoized selector
export const selectApplicationsData = createSelector(
	selectApplicationsResult,
	(applicationsResult) => applicationsResult.data, //normalized state object with ids & entities
);

//getSelectors create these selectors and we rename them with aliases using destructuring
export const {
	selectAll: selectAllApplications,
	selectById: selectApplicationById,
	selectIds: selectApplicationIds,

	//pass in a selector that returns the applications slice of state
} = applicationsAdapter.getSelectors(
	(state) => selectApplicationsData(state) ?? initialState,
);
