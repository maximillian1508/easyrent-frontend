import {
	Box,
	Divider,
	Grid,
	Paper,
	ScrollArea,
	Text,
	Title,
} from "@mantine/core";
import React from "react";
import useTitle from "../../hooks/useTitle";
import ComplaintCard from "./ComplaintCard";
import { useGetComplaintsQuery } from "./complaintsApiSlice";

const ManageComplaints = () => {
	useTitle("Manage Complaints");

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

	let content;

	if (isLoading) {
		content = <p>Loading...</p>;
	}
	if (isError) {
		content = <p>Error: {error?.data?.message}</p>;
	}
	if (isSuccess) {
		const { ids, entities } = complaints;

		const filteredComplaints = ids.map((id) => entities[id]);

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
				<div className="main-upper-section">
					<div>
						<h1>Complaints</h1>
					</div>
				</div>
				{content}
			</section>
		</main>
	);
};

export default ManageComplaints;
