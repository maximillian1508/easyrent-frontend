import { Button, Modal, ScrollArea, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React from "react";
import User from "./User";
import { useGetUsersQuery } from "./usersApiSlice";
import "./ManageUsers.css";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import AddNewUser from "./AddNewUser";

const ManageUsers = () => {
	useTitle("Manage Users");
	const [modalOpened, { open: modalOpen, close: modalClose }] =
		useDisclosure(false);
	const {
		data: users,
		isLoading,
		isSuccess,
		isError,
		error,
	} = useGetUsersQuery("usersList", {
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
		const { ids, entities } = users;

		// filter example
		/*
		let filteredIds;

		if (isAdmin) {
			filteredIds = [...ids];
		} else {
			filteredIds = ids.filter(
				(userId) => entities[userId].userType !== userType,
			);
		}
		*/

		const tableContent =
			ids?.length &&
			ids.map((userId, index) => (
				<User key={userId} userId={userId} rowNumber={index + 1} />
			));

		content = (
			<div style={{ flex: "1", minHeight: "0" }}>
				<ScrollArea h="100%">
					<Table highlightOnHover>
						<Table.Thead>
							<Table.Tr>
								<Table.Th>#</Table.Th>
								<Table.Th>Name</Table.Th>
								<Table.Th>Email</Table.Th>
								<Table.Th>Phone</Table.Th>
								<Table.Th>User Type</Table.Th>
								<Table.Th>Status</Table.Th>
								<Table.Th />
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
				<Modal
					opened={modalOpened}
					onClose={modalClose}
					title="Add New User"
					size="lg"
					centered
				>
					<AddNewUser closeModal={modalClose} />
				</Modal>
				<div className="main-upper-section">
					<div>
						<h1>Users</h1>
						<p>Manage your users here.</p>
					</div>
					<Button variant="er-blue" onClick={modalOpen}>
						Add New User
					</Button>
				</div>
				{content}
			</section>
		</main>
	);
};

export default ManageUsers;
