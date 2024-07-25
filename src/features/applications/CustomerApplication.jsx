import { Button, Grid, Text, Title } from "@mantine/core";
import React, { memo } from "react";
import { useGetApplicationsQuery } from "./applicationsApiSlice";

const CustomerApplication = ({ applicationId }) => {
	const { application } = useGetApplicationsQuery("applicationsList", {
		selectFromResult: ({ data }) => ({
			application: data?.entities[applicationId],
		}),
	});

	const getStatusColor = (status) => {
		switch (status) {
			case "Accepted":
			case "Completed":
				return "green"; // Light green
			case "Rejected":
			case "Cancelled":
				return "red"; // Light red
			case "Waiting for Response":
				return "yellow"; // Light yellow
			default:
				return "transparent";
		}
	};

	if (application) {
		return (
			<Grid.Col
				key={applicationId}
				span={12}
				style={{ padding: "0", marginTop: "1rem" }}
			>
				<section
					className="bordered-container"
					style={{ width: "100%", height: "fit-content" }}
				>
					<div
						className="main-upper-section"
						style={{ alignItems: "start", justifyContent: "space-between" }}
					>
						<div style={{ width: "30%" }}>
							<Title order={3} size="h4" lineClamp={1}>
								{application.property?.name} {application.roomName}
							</Title>
							<Text c="dimmed" lineClamp={2} style={{ textWrap: "wrap" }}>
								{application.property?.address}
							</Text>
						</div>
						<div style={{ width: "35%", alignSelf: "center" }}>
							<Text>Period:</Text>
							<Text w="fit-content">
								{new Intl.DateTimeFormat("en-GB", {
									year: "numeric",
									month: "short",
									day: "numeric",
								}).format(new Date(application.startDate))}{" "}
								-{" "}
								{new Intl.DateTimeFormat("en-GB", {
									year: "numeric",
									month: "short",
									day: "numeric",
								}).format(new Date(application.endDate))}
							</Text>
							<Text>Contract Length: {application.stayLength} months</Text>
							<Text>
								RM{application.property?.price || application.roomPrice}/month
							</Text>
						</div>
						<div>
							<Text
								style={{
									borderRadius: "5px",
									border: "solid 1px lightgrey",
									fontWeight: "500",
									padding: "0.5rem",
									height: "fit-content",
									width: "fit-content",
									color: "#fff",
									backgroundColor: getStatusColor(application.status),
								}}
							>
								{application.status}
							</Text>
						</div>
					</div>
					<div className="main-upper-section" style={{ marginBottom: "0" }}>
						<Text c="gray">
							{new Intl.DateTimeFormat("en-GB", {
								year: "numeric",
								month: "short",
								day: "numeric",
								hour: "2-digit",
								minute: "2-digit",
								second: "2-digit",
							}).format(new Date(application.createdAt))}
						</Text>
						{application.status === "Accepted" && (
							<Button
								variant="er-blue"
								component="a"
								href={`/application/sign-and-pay/${application.contract}`}
							>
								Sign & Pay
							</Button>
						)}
					</div>
				</section>
			</Grid.Col>
		);
	} else {
		return null;
	}
};

const memoizedCustomerApplication = memo(
	CustomerApplication,
	(prevProps, nextProps) => {
		return prevProps.applicationId === nextProps.applicationId;
	},
);

export default memoizedCustomerApplication;
