import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const transactionsAdapter = createEntityAdapter({});

const initialState = transactionsAdapter.getInitialState({});

export const transactionsApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getTransactions: builder.query({
			query: () => "/transactions",
			validateStatus: (response, result) => {
				return response.status === 200 && !result.isError;
			},
			transformResponse: (responseData) => {
				// get response from the query
				const loadedTransactions = responseData.transactions.map(
					(transaction) => {
						transaction.id = transaction._id;
						return transaction;
					},
				);
				return transactionsAdapter.setAll(initialState, loadedTransactions);
			},
			providesTags: (result, error, arg) => {
				if (result?.ids) {
					return [
						{ type: "Transaction", id: "LIST" },
						...result.ids.map((id) => ({ type: "Transaction", id })),
					];
				}
				return [{ type: "Transaction", id: "LIST" }];
			},
		}),
		addNewTransaction: builder.mutation({
			query: (initialTransactionData) => ({
				url: "/transactions",
				method: "POST",
				body: { ...initialTransactionData },
			}),
			invalidatesTags: [{ type: "Transaction", id: "LIST" }],
		}),
		updateTransaction: builder.mutation({
			query: (initialTransactionData) => ({
				url: `/transactions/${initialTransactionData.id}`,
				method: "PATCH",
				body: { ...initialTransactionData },
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: "Transaction", id: arg.id },
			],
		}),
		deleteTransaction: builder.mutation({
			query: (initialTransactionData) => ({
				url: `/transactions/${initialTransactionData.id}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: "Transaction", id: arg.id },
			],
		}),
		createPaymentIntent: builder.mutation({
			query: (paymentData) => ({
				url: "/transactions/create-payment-intent",
				method: "POST",
				body: paymentData,
			}),
		}),
		processDeposit: builder.mutation({
			query: (depositData) => ({
				url: "/transactions/process-deposit",
				method: "POST",
				body: depositData,
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: "Transaction", id: "LIST" },
				{ type: "Contract", id: arg.contractId },
			],
		}),
		processPayment: builder.mutation({
			query: (paymentData) => {
				
				return {
					url: "/transactions/process-payment",
					method: "POST",
					body: paymentData,
				};
			},
			// Add more detailed error logging
			async onQueryStarted(arg, { queryFulfilled }) {
				try {
					await queryFulfilled;
				} catch (error) {
					console.error("processPayment query failed:", error);
				}
			},
			extraOptions: { timeout: 60000 },
			invalidatesTags: (result, error, arg) => [
				{ type: "Transaction", id: "LIST" },
			],
		}),
	}),
});

export const {
	useGetTransactionsQuery,
	useAddNewTransactionMutation,
	useUpdateTransactionMutation,
	useDeleteTransactionMutation,
	useCreatePaymentIntentMutation,
	useProcessDepositMutation,
	useProcessPaymentMutation,
} = transactionsApiSlice;

// returns query result object
export const selectTransactionsResult =
	transactionsApiSlice.endpoints.getTransactions.select();

//creates a memoized selector
export const selectTransactionsData = createSelector(
	selectTransactionsResult,
	(transactionsResult) => transactionsResult.data, //normalized state object with ids & entities
);

//getSelectors create these selectors and we rename them with aliases using destructuring
export const {
	selectAll: selectAllTransactions,
	selectById: selectTransactionById,
	selectIds: selectTransactionIds,

	//pass in a selector that returns the transactions slice of state
} = transactionsAdapter.getSelectors(
	(state) => selectTransactionsData(state) ?? initialState,
);
