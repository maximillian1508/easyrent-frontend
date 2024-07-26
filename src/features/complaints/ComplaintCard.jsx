import { ActionIcon, Card, Modal, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import React, { useEffect, memo } from "react";
import useAuth from "../../hooks/useAuth";
import CompleteComplaint from "./CompleteComplaint";
import EditComplaint from "./EditComplaint";
import {
	useDeleteComplaintMutation,
	useUpdateComplaintMutation,
} from "./complaintsApiSlice";

const ComplaintCard = ({ complaint }) => {
	const { userType, userId } = useAuth();
	const [modalOpened, { open: modalOpen, close: modalClose }] =
		useDisclosure(false);
	const [
		completeModalOpened,
		{ open: completeModalOpen, close: completeModalClose },
	] = useDisclosure(false);

	const [
		updateComplaint,
		{ isSuccess: isUpdateSuccess, isError: isUpdateError },
	] = useUpdateComplaintMutation();

	const [deleteComplaint, { isLoading, isSuccess, isError, error }] =
		useDeleteComplaintMutation();

	useEffect(() => {
		if (isSuccess) {
			notifications.show({
				title: "Success",
				message: "Complaint deleted successfully",
				color: "green",
			});
		}

		if (isUpdateSuccess) {
			notifications.show({
				title: "Success",
				message: "Complaint status changed to in handling",
				color: "green",
			});
		}
	}, [isSuccess, isUpdateSuccess]);

	useEffect(() => {
		if (isError) {
			notifications.show({
				title: "Error",
				message: "An unexpected error occurred. Please try again.",
				color: "red",
			});
		}
		if (isUpdateError) {
			notifications.show({
				title: "Error",
				message: "An unexpected error occurred. Please try again.",
				color: "red",
			});
		}
	});

	return (
		<Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
			<Modal
				opened={modalOpened}
				onClose={modalClose}
				title="Edit Complaint"
				size="lg"
				centered
			>
				<EditComplaint closeModal={modalClose} id={complaint.id} />
			</Modal>
			<Modal
				opened={completeModalOpened}
				onClose={completeModalClose}
				title="Finish Complaint Handling"
				size="lg"
				centered
			>
				<CompleteComplaint
					closeModal={completeModalClose}
					id={complaint.id}
					admin={userId}
				/>
			</Modal>
			<div style={{ marginBottom: "0.75rem" }}>
				{userType === "admin" && (
					<>
						<Text size="sm" c="dimmed">
							Property: {complaint.property.name}
						</Text>
						<Text size="sm" c="dimmed">
							Tenant: {complaint.customer.firstname}{" "}
							{complaint.customer.lastname}
						</Text>
					</>
				)}
				{complaint.status !== "Waiting for Response" &&
					userType === "customer" && (
						<Text size="sm" c="dimmed">
							Admin: {complaint.admin.firstname} {complaint.admin.lastname}
						</Text>
					)}
				{complaint.status === "Handled" && (
					<Text size="sm" c="dimmed">
						Resolution: {complaint.resolutionDetails || "-"}
					</Text>
				)}
			</div>
			<div style={{ marginBottom: "1rem" }}>
				<Title weight={500} mb="0.25rem" order={3} size="h3">
					{complaint.title}
				</Title>
				<Text size="sm" lineClamp={3} mb="0.5rem">
					{complaint.description}
				</Text>
			</div>
			<div
				style={{
					marginTop: "auto",
					display: "flex",
					flexDirection: "row",
					alignItems: "end",
				}}
			>
				<Text size="sm" c="dimmed">
					{new Date(complaint.createdAt).toLocaleDateString("en-GB", {
						year: "numeric",
						month: "short",
						day: "numeric",
						hour: "2-digit",
						minute: "2-digit",
						second: "2-digit",
					})}
				</Text>
				{userType === "customer" ? (
					<div style={{ marginLeft: "auto" }}>
						<ActionIcon
							variant="light"
							color="gray"
							onClick={modalOpen}
							me="0.25rem"
						>
							<img src="/images/edit.svg" alt="edit" style={{ width: "70%" }} />
						</ActionIcon>
						<ActionIcon
							variant="filled"
							color="red"
							onClick={async () => await deleteComplaint({ id: complaint.id })}
						>
							<img
								src="/images/delete.svg"
								alt="delete"
								style={{ width: "70%" }}
							/>
						</ActionIcon>
					</div>
				) : (
					<div style={{ marginLeft: "auto" }}>
						<ActionIcon
							variant="filled"
							color="blue"
							onClick={async () => {
								if (complaint.status === "Waiting for Response") {
									await updateComplaint({
										id: complaint.id,
										status: "In Handling",
										admin: userId,
									});
								} else {
									completeModalOpen();
								}
							}}
						>
							<img
								src={
									complaint.status !== "Handled"
										? "/images/process.svg"
										: "/images/edit.svg"
								}
								alt="process"
								style={{ width: "70%" }}
							/>
						</ActionIcon>
					</div>
				)}
			</div>
		</Card>
	);
};

const memoizedComplaint = memo(ComplaintCard, (prevProps, nextProps) => {
	return (
		JSON.stringify(prevProps.complaint) === JSON.stringify(nextProps.complaint)
	);
});

export default memoizedComplaint;
