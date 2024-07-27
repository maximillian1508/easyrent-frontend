import {
	Card,
	Paper,
	ScrollArea,
	SimpleGrid,
	Table,
	Text,
	Title,
} from "@mantine/core";
import React from "react";
import { useGetApplicationsQuery } from "../../features/applications/applicationsApiSlice";
import { useGetPropertiesQuery } from "../../features/properties/propertiesApiSlice";
import { useGetTransactionsQuery } from "../../features/transactions/transactionsApiSlice";
import { useGetUsersQuery } from "../../features/users/usersApiSlice";

const AdminDashboard = () => {
	const { data: applications, isLoading: isLoadingApplications } =
		useGetApplicationsQuery();
	const { data: transactions, isLoading: isLoadingTransactions } =
		useGetTransactionsQuery();
	const { data: users } = useGetUsersQuery();
	const { data: properties } = useGetPropertiesQuery();

	const latestApplications = applications?.ids
		.map((id) => applications.entities[id])
		.filter((app) => app.status === "Waiting for Response")
		.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
		.slice(0, 5);

	const latestPayments = transactions?.ids
		.map((id) => transactions.entities[id])
		.filter((transaction) => transaction.status === "Paid")
		.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
		.slice(0, 5);

	const totalUsers = users?.ids.length || 0;
	const totalProperties = properties?.ids.length || 0;
	const totalPendingApplications =
		applications?.ids.filter(
			(id) => applications.entities[id].status === "Waiting for Response",
		).length || 0;

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleString("en-GB", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: false,
		});
	};

	const renderSummaryCards = () => (
		<SimpleGrid cols={3} spacing="lg" mb="lg">
			<Card shadow="sm" padding="lg" radius="md" withBorder>
				<Title order={3} align="center" mb="md">
					Total Users
				</Title>
				<Text weight={700} size="xl" align="center">
					{totalUsers}
				</Text>
			</Card>
			<Card shadow="sm" padding="lg" radius="md" withBorder>
				<Title order={3} align="center" mb="md">
					Total Properties
				</Title>
				<Text weight={700} size="xl" align="center">
					{totalProperties}
				</Text>
			</Card>
			<Card shadow="sm" padding="lg" radius="md" withBorder>
				<Title order={3} align="center" mb="md">
					Pending Applications
				</Title>
				<Text weight={700} size="xl" align="center">
					{totalPendingApplications}
				</Text>
			</Card>
		</SimpleGrid>
	);

	const renderLatestApplications = () => {
		if (isLoadingApplications) return <Text>Loading applications...</Text>;
		if (!latestApplications || latestApplications.length === 0)
			return <Text>No pending applications found.</Text>;

		return (
			<Table highlightOnHover>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Date</Table.Th>
						<Table.Th>Customer Name</Table.Th>
						<Table.Th>Property Name</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{latestApplications.map((application) => (
						<Table.Tr key={application.id}>
							<Table.Td>{formatDate(application.createdAt)}</Table.Td>
							<Table.Td>{`${application.user.firstname} ${application.user.lastname}`}</Table.Td>
							<Table.Td>{application.property.name}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
		);
	};

	const renderLatestPayments = () => {
		if (isLoadingTransactions) return <Text>Loading payments...</Text>;
		if (!latestPayments || latestPayments.length === 0)
			return <Text>No payments found.</Text>;

		return (
			<Table highlightOnHover>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Date</Table.Th>
						<Table.Th>Customer Name</Table.Th>
						<Table.Th>Property Name</Table.Th>
						<Table.Th>Amount</Table.Th>
						<Table.Th>Type</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{latestPayments.map((payment) => (
						<Table.Tr key={payment.id}>
							<Table.Td>{formatDate(payment.createdAt)}</Table.Td>
							<Table.Td>{`${payment.user.firstname} ${payment.user.lastname}`}</Table.Td>
							<Table.Td>{payment.property.name}</Table.Td>
							<Table.Td>${payment.amount}</Table.Td>
							<Table.Td>{payment.type}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
		);
	};

	return (
		<main className="main-container">
			{renderSummaryCards()}

			<Paper shadow="xs" p="md" mb="md">
				<Title order={2} mb="md">
					Latest Pending Applications
				</Title>
				<ScrollArea>{renderLatestApplications()}</ScrollArea>
			</Paper>

			<Paper shadow="xs" p="md" mb="md">
				<Title order={2} mb="md">
					Latest Payments
				</Title>
				<ScrollArea>{renderLatestPayments()}</ScrollArea>
			</Paper>
		</main>
	);
};

export default AdminDashboard;
