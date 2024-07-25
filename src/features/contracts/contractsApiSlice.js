import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const contractsAdapter = createEntityAdapter({});

const initialState = contractsAdapter.getInitialState({});

export const contractsApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getContracts: builder.query({
			query: () => "/contracts",
			validateStatus: (response, result) => {
				return response.status === 200 && !result.isError;
			},
			transformResponse: (responseData) => {
				// get response from the query
				const loadedContracts = responseData.contracts.map((contract) => {
					contract.id = contract._id;
					return contract;
				});
				return contractsAdapter.setAll(initialState, loadedContracts);
			},
			providesTags: (result, error, arg) => {
				if (result?.ids) {
					return [
						{ type: "Contract", id: "LIST" },
						...result.ids.map((id) => ({ type: "Contract", id })),
					];
				}
				return [{ type: "Contract", id: "LIST" }];
			},
		}),
		addNewContract: builder.mutation({
			query: (initialContractData) => ({
				url: "/contracts",
				method: "POST",
				body: { ...initialContractData },
			}),
			invalidatesTags: [{ type: "Contract", id: "LIST" }],
		}),
		updateContract: builder.mutation({
			query: (initialContractData) => ({
				url: `/contracts/${initialContractData.id}`,
				method: "PATCH",
				body: { ...initialContractData },
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: "Contract", id: arg.id },
			],
		}),
		deleteContract: builder.mutation({
			query: (initialContractData) => ({
				url: `/contracts/${initialContractData.id}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: "Contract", id: arg.id },
			],
		}),
		uploadSignedContract: builder.mutation({
			query: ({ contractId, formData }) => ({
				url: `/contracts/upload-signed-contract/${contractId}`,
				method: "POST",
				body: formData,
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: "Contract", id: arg.contractId },
			],
		}),
	}),
});

export const {
	useGetContractsQuery,
	useAddNewContractMutation,
	useUpdateContractMutation,
	useDeleteContractMutation,
	useUploadSignedContractMutation,
} = contractsApiSlice;

// returns query result object
export const selectContractsResult =
	contractsApiSlice.endpoints.getContracts.select();

//creates a memoized selector
export const selectContractsData = createSelector(
	selectContractsResult,
	(contractsResult) => contractsResult.data, //normalized state object with ids & entities
);

//getSelectors create these selectors and we rename them with aliases using destructuring
export const {
	selectAll: selectAllContracts,
	selectById: selectContractById,
	selectIds: selectContractIds,

	//pass in a selector that returns the contracts slice of state
} = contractsAdapter.getSelectors(
	(state) => selectContractsData(state) ?? initialState,
);
