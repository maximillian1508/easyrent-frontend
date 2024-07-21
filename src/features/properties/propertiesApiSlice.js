import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const propertiesAdapter = createEntityAdapter({});

const initialState = propertiesAdapter.getInitialState({});

export const propertiesApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getProperties: builder.query({
			query: () => "/properties",
			validateStatus: (response, result) => {
				return response.status === 200 && !result.isError;
			},
			transformResponse: (responseData) => {
				// get response from the query
				const loadedProperties = responseData.properties.map((property) => {
					property.id = property._id;
					return property;
				});
				return propertiesAdapter.setAll(initialState, loadedProperties);
			},
			providesTags: (result, error, arg) => {
				if (result?.ids) {
					return [
						{ type: "Property", id: "LIST" },
						...result.ids.map((id) => ({ type: "Property", id })),
					];
				}
				return [{ type: "Property", id: "LIST" }];
			},
		}),
		addNewProperty: builder.mutation({
			query: (initialPropertyData) => {
				const formData = new FormData();

				// Append text fields
				for (const [key, value] of Object.entries(initialPropertyData)) {
					if (key !== "images" && key !== "rooms") {
						formData.append(key, value);
					}
				}

				//APPEND ROOMS AS JSON STRING
				if (initialPropertyData.rooms) {
					formData.append("rooms", JSON.stringify(initialPropertyData.rooms));
				}

				// Append images
				initialPropertyData.images.forEach((file, index) => {
					formData.append("images", file);
				});

				return {
					url: "/properties",
					method: "POST",
					body: formData,
					// Don't manually set Content-Type, let it be automatic
				};
			},
			invalidatesTags: [{ type: "Property", id: "LIST" }],
		}),
		updateProperty: builder.mutation({
			query: (initialPropertyData) => ({
				url: `/properties/${initialPropertyData.id}`,
				method: "PATCH",
				body: { ...initialPropertyData },
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: "Property", id: arg.id },
			],
		}),
		deleteProperty: builder.mutation({
			query: (initialPropertyData) => ({
				url: `/properties/${initialPropertyData.id}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: "Property", id: arg.id },
			],
		}),
	}),
});

export const {
	useGetPropertiesQuery,
	useAddNewPropertyMutation,
	useUpdatePropertyMutation,
	useDeletePropertyMutation,
} = propertiesApiSlice;

// returns query result object
export const selectPropertiesResult =
	propertiesApiSlice.endpoints.getProperties.select();

//creates a memoized selector
export const selectPropertiesData = createSelector(
	selectPropertiesResult,
	(propertiesResult) => propertiesResult.data, //normalized state object with ids & entities
);

//getSelectors create these selectors and we rename them with aliases using destructuring
export const {
	selectAll: selectAllProperties,
	selectById: selectPropertyById,
	selectIds: selectPropertyIds,

	//pass in a selector that returns the properties slice of state
} = propertiesAdapter.getSelectors(
	(state) => selectPropertiesData(state) ?? initialState,
);
