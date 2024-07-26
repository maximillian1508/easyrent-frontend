import {
	Box,
	Button,
	Divider,
	Grid,
	Modal,
	Paper,
	ScrollArea,
	Text,
	Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import React from "react";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import { useGetUserRentalStatusQuery } from "../applications/applicationsApiSlice";
import AddNewComplaint from "./AddNewComplaint";
import ComplaintCard from "./ComplaintCard";
import { useGetComplaintsQuery } from "./complaintsApiSlice";

const ComplaintHistory = () => {
	useTitle("Complaint History");
	const { userId } = useAuth();
	const [modalOpened, { open: modalOpen, close: modalClose }] =
		useDisclosure(false);
	const {
		data: complaints,
		isLoading,
		isSuccess,
		isError,
		error,
	} = useGetComplaintsQuery("complaintsList", {
		pollingInterval: 60000,
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true,
	});

	const { data: userStatus, isLoading: isStatusLoading } =
		useGetUserRentalStatusQuery(userId);

	const checkOpenModal = async () => {
		if (!userStatus?.canApply) {
			modalOpen();
		} else {
			notifications.show({
				title: "Error",
				message:
					"You cannot add a complaint as you don't have an active rental or accepted application.",
				color: "red",
			});
		}
	};

	let content;

	if (isLoading) {
		content = <p>Loading...</p>;
	}
	if (isError) {
		content = <p>Error: {error?.data?.message}</p>;
	}
	if (isSuccess) {
		const { ids, entities } = complaints;
		const filteredComplaints = ids
			.filter((complaintId) => entities[complaintId].customer._id === userId)
			.map((complaintId) => entities[complaintId]);

		const waitingComplaints = filteredComplaints.filter(
			(complaint) => complaint.status === "Waiting for Response",
		);
		const inHandlingComplaints = filteredComplaints.filter(
			(complaint) => complaint.status === "In Handling",
		);
		const handledComplaints = filteredComplaints.filter(
			(complaint) => complaint.status === "Handled",
		);

		content = (
			<Box
				style={{
					height: "calc(100vh - 10rem)",
					display: "flex",
					flexDirection: "column",
				}}
			>
				<Grid
					style={{ flex: 1, minHeight: 0 }}
					gutter="md"
					styles={{ inner: { height: "100%" } }}
				>
					{[
						{ title: "Waiting", complaints: waitingComplaints },
						{ title: "In Handling", complaints: inHandlingComplaints },
						{ title: "Handled", complaints: handledComplaints },
					].map(({ title, complaints }) => (
						<Grid.Col
							key={title}
							span={{ base: 12, sm: 4 }}
							style={{ height: "100%" }}
						>
							<Paper
								style={{
									height: "100%",
									border: "solid 1px lightgrey",
									borderRadius: "7px",
									padding: "0.75rem 1.25rem",
									display: "flex",
									flexDirection: "column",
								}}
							>
								<Title order={2} size="h3" mb="xs">
									{title}
								</Title>
								<Divider mb="sm" />
								<ScrollArea>
									{complaints.map((complaint) => (
										<ComplaintCard key={complaint._id} complaint={complaint} />
									))}
									{complaints.length === 0 && (
										<Text color="dimmed" align="center">
											No complaints in this category
										</Text>
									)}
								</ScrollArea>
							</Paper>
						</Grid.Col>
					))}
				</Grid>
			</Box>
		);
	}

	return (
		<main className="main-container">
			<section>
				<Modal
					opened={modalOpened}
					onClose={modalClose}
					title="Add New Complaint"
					size="lg"
					centered
				>
					<AddNewComplaint closeModal={modalClose} userId={userId} />
				</Modal>
				<div className="main-upper-section">
					<div>
						<h1>Complaints</h1>
					</div>
					<Button
						variant="er-blue"
						onClick={async () => {
							await checkOpenModal();
						}}
						loading={isStatusLoading}
					>
						Add Complaint
					</Button>
				</div>
				{content}
			</section>
		</main>
	);
};

export default ComplaintHistory;
