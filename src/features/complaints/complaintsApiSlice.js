import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const complaintsAdapter = createEntityAdapter({});

const initialState = complaintsAdapter.getInitialState({});

export const complaintsApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getComplaints: builder.query({
			query: () => "/complaints",
			validateStatus: (response, result) => {
				return response.status === 200 && !result.isError;
			},
			transformResponse: (responseData) => {
				// get response from the query
				const loadedComplaints = responseData.complaints.map((complaint) => {
					complaint.id = complaint._id;
					return complaint;
				});
				return complaintsAdapter.setAll(initialState, loadedComplaints);
			},
			providesTags: (result, error, arg) => {
				if (result?.ids) {
					return [
						{ type: "Complaint", id: "LIST" },
						...result.ids.map((id) => ({ type: "Complaint", id })),
					];
				}
				return [{ type: "Complaint", id: "LIST" }];
			},
		}),
		addNewComplaint: builder.mutation({
			query: (initialComplaintData) => ({
				url: "/complaints",
				method: "POST",
				body: { ...initialComplaintData },
			}),
			invalidatesTags: [{ type: "Complaint", id: "LIST" }],
		}),
		updateComplaint: builder.mutation({
			query: (initialComplaintData) => ({
				url: `/complaints/${initialComplaintData.id}`,
				method: "PATCH",
				body: { ...initialComplaintData },
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: "Complaint", id: arg.id },
			],
		}),
		deleteComplaint: builder.mutation({
			query: (initialComplaintData) => ({
				url: `/complaints/${initialComplaintData.id}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: "Complaint", id: arg.id },
			],
		}),
	}),
});

export const {
	useGetComplaintsQuery,
	useAddNewComplaintMutation,
	useUpdateComplaintMutation,
	useDeleteComplaintMutation,
} = complaintsApiSlice;

// returns query result object
export const selectComplaintsResult =
	complaintsApiSlice.endpoints.getComplaints.select();

//creates a memoized selector
export const selectComplaintsData = createSelector(
	selectComplaintsResult,
	(complaintsResult) => complaintsResult.data, //normalized state object with ids & entities
);

//getSelectors create these selectors and we rename them with aliases using destructuring
export const {
	selectAll: selectAllComplaints,
	selectById: selectComplaintById,
	selectIds: selectComplaintIds,

	//pass in a selector that returns the complaints slice of state
} = complaintsAdapter.getSelectors(
	(state) => selectComplaintsData(state) ?? initialState,
);
