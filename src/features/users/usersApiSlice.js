import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const usersAdapter = createEntityAdapter({});

const initialState = usersAdapter.getInitialState({});

export const usersApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getUsers: builder.query({
			query: () => "/users",
			validateStatus: (response, result) => {
				return response.status === 200 && !result.isError;
			},
			transformResponse: (responseData) => {
				// get response from the query
				const loadedUsers = responseData.users.map((user) => {
					user.id = user._id;
					return user;
				});
				return usersAdapter.setAll(initialState, loadedUsers);
			},
			providesTags: (result, error, arg) => {
				if (result?.ids) {
					return [
						{ type: "User", id: "LIST" },
						...result.ids.map((id) => ({ type: "User", id })),
					];
				}
				return [{ type: "User", id: "LIST" }];
			},
		}),
		addNewUser: builder.mutation({
			query: (initialUserData) => ({
				url: "/users",
				method: "POST",
				body: { ...initialUserData },
			}),
			invalidatesTags: [{ type: "User", id: "LIST" }],
		}),
		updateUser: builder.mutation({
			query: (initialUserData) => ({
				url: `/users/${initialUserData.id}`,
				method: "PATCH",
				body: { ...initialUserData },
			}),
			invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
		}),
		deleteUser: builder.mutation({
			query: (initialUserData) => ({
				url: `/users/${initialUserData.id}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
		}),
	}),
});

export const {
	useGetUsersQuery,
	useAddNewUserMutation,
	useUpdateUserMutation,
	useDeleteUserMutation,
} = usersApiSlice;

// returns query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

//creates a memoized selector
export const selectUsersData = createSelector(
	selectUsersResult,
	(usersResult) => usersResult.data, //normalized state object with ids & entities
);

//getSelectors create these selectors and we rename them with aliases using destructuring
export const {
	selectAll: selectAllUsers,
	selectById: selectUserById,
	selectIds: selectUserIds,

	//pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors(
	(state) => selectUsersData(state) ?? initialState,
);
