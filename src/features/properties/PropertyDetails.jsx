import { Carousel } from "@mantine/carousel";
import {
	Button,
	Image,
	Indicator,
	ScrollArea,
	Spoiler,
	Table,
	Text,
	ThemeIcon,
	Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useTitle from "../../hooks/useTitle";
import { useGetApplicationsQuery } from "../applications/applicationsApiSlice";
import { useGetTransactionsQuery } from "../transactions/transactionsApiSlice";
import {
	useDeletePropertyMutation,
	useGetPropertiesQuery,
} from "./propertiesApiSlice";

const PropertyDetails = () => {
	useTitle("Property Details");

	const { propertyId } = useParams();
	const { property } = useGetPropertiesQuery("propertiesList", {
		selectFromResult: ({ data }) => ({
			property: data?.entities[propertyId],
		}),
	});

	const { data: transactionsData, isLoading: transactionsLoading } =
		useGetTransactionsQuery();

	// Filter transactions for this property
	const propertyTransactions = transactionsData?.ids
		.map((id) => transactionsData.entities[id])
		.filter((transaction) => transaction.property._id === propertyId);

	const { data: applications } = useGetApplicationsQuery();

	const pendingApplicationCount =
		applications?.ids.filter(
			(id) =>
				applications.entities[id].property._id === propertyId &&
				applications.entities[id].status === "Waiting for Response",
		).length || 0;

	const navigate = useNavigate();

	const [deleteProperty, { isLoading, isSuccess, isError, error }] =
		useDeletePropertyMutation();

	useEffect(() => {
		if (isSuccess) {
			navigate("/manage-properties");
			notifications.show({
				title: "Success",
				message: "Property deleted successfully",
				color: "green",
			});
		}
	}, [isSuccess, navigate]);

	useEffect(() => {
		if (isError) {
			notifications.show({
				title: "Error",
				message: "An unexpected error occurred. Please try again.",
				color: "red",
			});
		}
	});

	console.log(transactionsData);
	console.log(propertyTransactions);
	console.log(property);

	return (
		<main className="main-container">
			<section style={{ margin: "1rem 0" }}>
				<div className="main-upper-section">
					<Button
						variant="outline"
						color="black"
						component="a"
						href="/manage-properties"
						leftSection={
							<ThemeIcon variant="transparent">
								<img
									src="/images/back.svg"
									style={{ width: "90%" }}
									alt="back"
								/>
							</ThemeIcon>
						}
					>
						Go Back
					</Button>
					<Indicator
						label={pendingApplicationCount}
						size={30}
						radius="xl"
						color="red"
						disabled={pendingApplicationCount === 0}
						position="top-end"
						styles={{
							indicator: { fontSize: "1.1rem", fontWeight: "500" },
						}}
						withBorder
					>
						<Button
							variant="outline"
							color="black"
							component="a"
							href={`/manage-properties/applications/${propertyId}`}
							leftSection={
								<ThemeIcon variant="transparent">
									<img
										src="/images/apply.svg"
										style={{ width: "90%" }}
										alt="Applications"
									/>
								</ThemeIcon>
							}
						>
							Applications
						</Button>
					</Indicator>
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between",
						margin: "2rem 0 2.5rem 0",
					}}
				>
					<div style={{ width: "35%", height: "250", display: "flex" }}>
						<Carousel
							controlSize={30}
							loop
							withControls
							withIndicators={true}
							draggable
							styles={{
								root: {
									flex: "1",
								},
								control: {
									backgroundColor: "#fff",
								},
								indicator: {
									backgroundColor: "#33415c",
									border: "solid 1px lightgrey",
								},
							}}
						>
							{property?.images && property.images.length > 0 ? (
								property.images.map((image, index) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									<Carousel.Slide key={index + 1} h={250}>
										<Image
											src={image}
											alt={property.name || "Property image"}
											fit="cover"
											style={{
												width: "100%",
												height: "100%",
												borderRadius: "10px",
											}}
											fallbackSrc="/images/no-image.svg"
										/>
									</Carousel.Slide>
								))
							) : (
								<Carousel.Slide key="no-image" h={250}>
									<img
										src="/images/no-image.svg"
										alt="no-image"
										style={{
											width: "100%",
											height: "100%",
											borderRadius: "10px",
											border: "solid 1px lightgrey",
										}}
									/>
								</Carousel.Slide>
							)}
						</Carousel>
					</div>
					<div style={{ width: "35%" }}>
						<Title order={2} size="h1">
							{property?.name}
						</Title>

						<p className="heading-info">{` ${property?.address}`}</p>
						{property?.type === "Unit Rental" && (
							<>
								<Title order={3} size="h2">
									RM{property?.price}
								</Title>
								<Text mb="0.5rem">Deposit: RM{property?.depositAmount}</Text>
							</>
						)}
						<Spoiler maxHeight={130} showLabel="Show more" hideLabel="Hide">
							<p>{property?.description}</p>
						</Spoiler>
					</div>
					<div
						style={{
							width: "20%",
							border: "solid 1px lightgrey",
							borderRadius: "10px ",
							height: "30vh",
							display: "flex",
							flexDirection: "column",
							gap: "1rem",
							padding: "1rem",
							justifyContent: "center",
						}}
					>
						<Text
							style={{
								fontWeight: "500",
								padding: "0 0.5rem",
								border: "solid 1px lightgrey",
								borderRadius: "5px",
								width: "fit-content",
								alignSelf: "center",
							}}
						>
							{property?.type}
						</Text>
						<Button
							variant="er-blue"
							component="a"
							href={`/manage-properties/edit/${propertyId}`}
						>
							Edit
						</Button>
						<Button
							variant="filled"
							color="red"
							onClick={async () => await deleteProperty({ id: property.id })}
						>
							Delete
						</Button>
					</div>
				</div>
			</section>
			{property?.type === "Room Rental" && (
				<section
					className="bordered-container"
					style={{ marginBottom: "2.5rem", width: "100%" }}
				>
					<div className="main-upper-section">
						<h1>Rooms</h1>
					</div>
					<div style={{ flex: "1", minHeight: "0" }}>
						<ScrollArea h="100%">
							<Table highlightOnHover>
								<Table.Thead>
									<Table.Tr>
										<Table.Th>#</Table.Th>
										<Table.Th>Name</Table.Th>
										<Table.Th>Price</Table.Th>
										<Table.Th>Deposit</Table.Th>
										<Table.Th>Description</Table.Th>
										<Table.Th>Tenant</Table.Th>
									</Table.Tr>
								</Table.Thead>
								<Table.Tbody>
									{property?.rooms?.map((room, index) => (
										// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
										<Table.Tr key={index + 1}>
											<Table.Td>{index + 1}</Table.Td>
											<Table.Td>{room.name}</Table.Td>
											<Table.Td>RM{room.price}</Table.Td>
											<Table.Td>RM{room.depositAmount}</Table.Td>
											<Table.Td>{room.description || "-"}</Table.Td>
											<Table.Td>{room.occupant || "-"}</Table.Td>
										</Table.Tr>
									))}
								</Table.Tbody>
							</Table>
						</ScrollArea>
					</div>
				</section>
			)}
			<section
				className="bordered-container"
				style={{ marginBottom: "2.5rem", width: "100%" }}
			>
				<div className="main-upper-section">
					<h1>Transactions</h1>
				</div>
				<div style={{ flex: "1", minHeight: "0" }}>
					<ScrollArea h="100%">
						<Table highlightOnHover>
							<Table.Thead>
								<Table.Tr>
									<Table.Th>#</Table.Th>
									{property?.type === "Room Rental" && (
										<Table.Th>Room</Table.Th>
									)}
									<Table.Th>Cust. Name</Table.Th>
									<Table.Th>Cust. Email</Table.Th>
									<Table.Th>Type</Table.Th>
									<Table.Th>Amount</Table.Th>
									<Table.Th>Due Date</Table.Th>
									<Table.Th>Status</Table.Th>
									<Table.Th>Payment Date</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{transactionsLoading ? (
									<Table.Tr>
										<Table.Td colSpan={6}>Loading transactions...</Table.Td>
									</Table.Tr>
								) : propertyTransactions && propertyTransactions.length > 0 ? (
									propertyTransactions.map((transaction, index) => (
										<Table.Tr key={transaction.id}>
											<Table.Td>{index + 1}</Table.Td>
											{transaction.roomName && (
												<Table.Td>{transaction.roomName}</Table.Td>
											)}
											<Table.Td>
												{transaction.user.firstname} {transaction.user.lastname}
											</Table.Td>
											<Table.Td>{transaction.user.email}</Table.Td>
											<Table.Td>{transaction.type}</Table.Td>
											<Table.Td>RM{transaction.amount}</Table.Td>
											<Table.Td>
												{new Date(transaction.dueDate).toLocaleDateString()}
											</Table.Td>
											<Table.Td>{transaction.status}</Table.Td>
											<Table.Td>
												{transaction.paymentDate
													? new Date(
															transaction.paymentDate,
														).toLocaleDateString()
													: "-"}
											</Table.Td>
										</Table.Tr>
									))
								) : (
									<Table.Tr>
										<Table.Td colSpan={6}>
											No transactions found for this property.
										</Table.Td>
									</Table.Tr>
								)}
							</Table.Tbody>
						</Table>
					</ScrollArea>
				</div>
			</section>
		</main>
	);
};

export default PropertyDetails;
