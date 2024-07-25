import { ScrollArea, Table } from "@mantine/core";
import React from "react";
import useTitle from "../../hooks/useTitle";
import Transaction from "./Transaction";
import { useGetTransactionsQuery } from "./transactionsApiSlice";

const ManageTransactions = () => {
	useTitle("Manage Transactions");
	const {
		data: transactions,
		isLoading,
		isSuccess,
		isError,
		error,
	} = useGetTransactionsQuery("transactionsList", {
		pollingInterval: 60000,
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true,
	});

	let content;

	if (isLoading) {
		content = <p>Loading...</p>;
	}

	if (isError) {
		content = <p>Error: {error?.data?.message}</p>;
	}

	if (isSuccess) {
		//ids is just an array of user ids
		const { ids, entities } = transactions;

		const tableContent =
			ids?.length > 0 ? (
				ids.map((transactionId, index) => (
					<Transaction
						key={transactionId}
						transactionId={transactionId}
						rowNumber={index + 1}
					/>
				))
			) : (
				<tr>No transactions found.</tr>
			);

		content = (
			<div style={{ flex: "1", minHeight: "0" }}>
				<ScrollArea h="100%">
					<Table highlightOnHover>
						<Table.Thead>
							<Table.Tr>
								<Table.Th>#</Table.Th>
								<Table.Th>Property Name</Table.Th>
								<Table.Th>Cust. Name</Table.Th>
								<Table.Th>Cust. Email</Table.Th>
								<Table.Th>Type</Table.Th>
								<Table.Th>Amount</Table.Th>
								<Table.Th>Due Date</Table.Th>
								<Table.Th>Status</Table.Th>
								<Table.Th>Payment Date</Table.Th>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>{tableContent}</Table.Tbody>
					</Table>
				</ScrollArea>
			</div>
		);
	}

	return (
		<main className="full-height-container">
			<section className="bordered-container">
				<div className="main-upper-section">
					<div>
						<h1>Transactions</h1>
					</div>
				</div>
				{content}
			</section>
		</main>
	);
};

export default ManageTransactions;
