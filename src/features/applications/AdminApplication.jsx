import { ActionIcon, LoadingOverlay, Table } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import React, { memo } from "react";
import {
	useGetApplicationsQuery,
	useUpdateApplicationMutation,
} from "./applicationsApiSlice";

const AdminApplication = ({ applicationId, rowNumber }) => {
	const { application } = useGetApplicationsQuery("applicationsList", {
		selectFromResult: ({ data }) => ({
			application: data?.entities[applicationId],
		}),
	});

	const [updateApplication, { isLoading, isSuccess, isError, error }] =
		useUpdateApplicationMutation();

	const handleAccept = async () => {
		try {
			await updateApplication({
				id: applicationId,
				status: "Accepted",
			}).unwrap();
			notifications.show({
				title: "Success",
				message: "Application accepted successfully",
				color: "green",
			});
		} catch (err) {
			notifications.show({
				title: "Error",
				message: "Failed to accept application",
				color: "red",
			});
			console.error("Failed to accept application:", err);
		}
	};

	const handleReject = async () => {
		try {
			await updateApplication({
				id: applicationId,
				status: "Rejected",
			}).unwrap();
			notifications.show({
				title: "Success",
				message: "Application rejected successfully",
				color: "green",
			});
		} catch (err) {
			notifications.show({
				title: "Error",
				message: "Failed to reject application",
				color: "red",
			});
			console.error("Failed to reject application:", err);
		}
	};

	if (isLoading) {
		return <LoadingOverlay visible={true} />;
	}

	if (application) {
		
		return (
			<>
				<Table.Tr>
					<Table.Td>{rowNumber}</Table.Td>
					<Table.Td>{`${application.user.firstname} ${application.user.lastname}`}</Table.Td>
					<Table.Td>{application.user.email}</Table.Td>
					<Table.Td>
						{new Intl.DateTimeFormat("en-GB", {
							year: "numeric",
							month: "short",
							day: "numeric",
						}).format(new Date(application.startDate))}
					</Table.Td>
					<Table.Td>{application.stayLength} months</Table.Td>
					<Table.Td>
						{new Intl.DateTimeFormat("en-GB", {
							year: "numeric",
							month: "short",
							day: "numeric",
						}).format(new Date(application.endDate))}
					</Table.Td>
					<Table.Td>{application.status}</Table.Td>
					{application.status === "Waiting for Response" && (
						<Table.Td>
							<ActionIcon variant="filled" color="green" onClick={handleAccept}>
								<img
									src="/images/check.svg"
									alt="check"
									style={{ width: "70%" }}
								/>
							</ActionIcon>
							<ActionIcon
								variant="filled"
								color="red"
								style={{ marginLeft: "1rem" }}
								onClick={handleReject}
							>
								<img src="/images/x.svg" alt="x" style={{ width: "70%" }} />
							</ActionIcon>
						</Table.Td>
					)}
				</Table.Tr>
			</>
		);
	} else {
		return null;
	}
};

const memoizedApplication = memo(AdminApplication, (prevProps, nextProps) => {
	return prevProps.applicationId === nextProps.applicationId;
});

export default memoizedApplication;
