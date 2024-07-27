import {
	Badge,
	Card,
	Group,
	Paper,
	ScrollArea,
	Table,
	Text,
	Title,
} from "@mantine/core";
import React from "react";
import { useGetContractsQuery } from "../../features/contracts/contractsApiSlice";
import { useGetTransactionsQuery } from "../../features/transactions/transactionsApiSlice";
import useAuth from "../../hooks/useAuth";

const CustomerDashboard = () => {
	const { userId } = useAuth();
	const { data: contracts, isLoading: isLoadingContracts } =
		useGetContractsQuery();
	const { data: transactions, isLoading: isLoadingTransactions } =
		useGetTransactionsQuery();

	const currentContract =
		contracts?.entities[
			contracts.ids.find(
				(id) =>
					contracts.entities[id].user._id === userId &&
					contracts.entities[id].isActive,
			)
		];

	const userContracts = contracts?.ids
		.map((id) => contracts.entities[id])
		.filter((contract) => contract.user._id === userId)
		.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
		.slice(0, 5);

	const userTransactions = transactions?.ids
		.map((id) => transactions.entities[id])
		.filter((transaction) => transaction.user._id === userId)
		.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
		.slice(0, 5);

	const renderCurrentRental = () => {
		if (isLoadingContracts) return <Text>Loading current rental...</Text>;
		if (!currentContract) return <Text>No current rental found.</Text>;

		return (
			<Card shadow="sm" padding="lg" radius="md" withBorder>
				<Group position="apart" mt="md" mb="xs">
					<Text weight={500}>{currentContract.property.name}</Text>
					<Badge color="green" variant="light">
						Active
					</Badge>
				</Group>

				<Group mt="md" mb="xs">
					<Text size="sm">
						Start Date:{" "}
						{new Date(currentContract.startDate).toLocaleDateString()}
					</Text>
					<Text size="sm">
						End Date: {new Date(currentContract.endDate).toLocaleDateString()}
					</Text>
				</Group>

				<Text size="sm" c="dimmed">
					Rent Amount: ${currentContract.rentAmount}
				</Text>
			</Card>
		);
	};

	const renderRentalHistory = () => {
		if (isLoadingContracts) return <Text>Loading rental history...</Text>;
		if (!userContracts || userContracts.length === 0)
			return <Text>No rental history found.</Text>;

		return (
			<Table>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Property</Table.Th>
						<Table.Th>Start Date</Table.Th>
						<Table.Th>End Date</Table.Th>
						<Table.Th>Rent Amount</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{userContracts.map((contract) => (
						<Table.Tr key={contract.id}>
							<Table.Td>{contract.property.name}</Table.Td>
							<Table.Td>
								{new Date(contract.startDate).toLocaleDateString()}
							</Table.Td>
							<Table.Td>
								{new Date(contract.endDate).toLocaleDateString()}
							</Table.Td>
							<Table.Td>${contract.rentAmount}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
		);
	};

	const renderPaymentHistory = () => {
		if (isLoadingTransactions) return <Text>Loading payment history...</Text>;
		if (!userTransactions || userTransactions.length === 0)
			return <Text>No payment history found.</Text>;

		return (
			<Table>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Date</Table.Th>
						<Table.Th>Amount</Table.Th>
						<Table.Th>Type</Table.Th>
						<Table.Th>Status</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{userTransactions.map((transaction) => (
						<Table.Tr key={transaction.id}>
							<Table.Td>
								{new Date(transaction.createdAt).toLocaleDateString()}
							</Table.Td>
							<Table.Td>${transaction.amount}</Table.Td>
							<Table.Td>{transaction.type}</Table.Td>
							<Table.Td>{transaction.status}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
		);
	};

	return (
		<main className="main-container">
			<Paper shadow="xs" p="md" mb="md">
				<Title order={2} mb="md">
					Current Rental
				</Title>
				{renderCurrentRental()}
			</Paper>

			<Paper shadow="xs" p="md" mb="md">
				<Title order={2} mb="md">
					Most Recent Rentals
				</Title>
				<ScrollArea>{renderRentalHistory()}</ScrollArea>
			</Paper>

			<Paper shadow="xs" p="md" mb="md">
				<Title order={2} mb="md">
					Most Recent Payments
				</Title>
				<ScrollArea>{renderPaymentHistory()}</ScrollArea>
			</Paper>
		</main>
	);
};

export default CustomerDashboard;
