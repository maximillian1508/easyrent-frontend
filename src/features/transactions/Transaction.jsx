import { Button, Table } from "@mantine/core";
import React, { memo } from "react";
import useAuth from "../../hooks/useAuth";
import { useGetTransactionsQuery } from "./transactionsApiSlice";

const Transaction = ({ transactionId, rowNumber }) => {
	const { userType } = useAuth();
	const { transaction } = useGetTransactionsQuery("transactionsList", {
		selectFromResult: ({ data }) => ({
			transaction: data?.entities[transactionId],
		}),
	});

	if (transaction) {
		console.log(transaction);
		return (
			<>
				<Table.Tr>
					<Table.Td>{rowNumber}</Table.Td>
					<Table.Td>
						{transaction.property.name}{" "}
						{transaction.roomName ? `(${transaction.roomName})` : ""}
					</Table.Td>
					{userType === "admin" && (
						<>
							<Table.Td>
								{transaction.user.firstname} {transaction.user.lastname}
							</Table.Td>
							<Table.Td>{transaction.user.email}</Table.Td>
						</>
					)}
					<Table.Td>{transaction.type}</Table.Td>
					<Table.Td>{transaction.amount}</Table.Td>
					<Table.Td>
						{new Intl.DateTimeFormat("en-GB", {
							year: "numeric",
							month: "short",
							day: "numeric",
						}).format(new Date(transaction.dueDate))}
					</Table.Td>
					<Table.Td>{transaction.status}</Table.Td>
					<Table.Td>
						{transaction.paymentDate
							? new Intl.DateTimeFormat("en-GB", {
									year: "numeric",
									month: "short",
									day: "numeric",
								}).format(new Date(transaction.paymentDate))
							: "-"}
					</Table.Td>
					{userType === "customer" && transaction.type !== "Deposit" && (
						<Table.Td>
							<Button variant="er-blue">Pay</Button>
						</Table.Td>
					)}
				</Table.Tr>
			</>
		);
	} else {
		return null;
	}
};

const memoizedTransaction = memo(Transaction, (prevProps, nextProps) => {
	return (
		prevProps.transactionId === nextProps.transactionId &&
		prevProps.rowNumber === nextProps.rowNumber
	);
});

export default memoizedTransaction;
