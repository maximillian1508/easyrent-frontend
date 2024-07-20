import { ActionIcon, Drawer, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import React, { useEffect, memo } from "react";
import EditUser from "./EditUser";
import { useDeleteUserMutation } from "./usersApiSlice";
import { useGetUsersQuery } from "./usersApiSlice";

const User = ({ userId }) => {
	const { user } = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			user: data?.entities[userId],
		}),
	});

	const [drawerOpened, { open: drawerOpen, close: drawerClose }] =
		useDisclosure(false);
	const [deleteUser, { isLoading, isSuccess, isError, error }] =
		useDeleteUserMutation();

	useEffect(() => {
		if (isSuccess) {
			notifications.show({
				title: "Success",
				message: "User deleted successfully",
				color: "green",
			});
		}
	}, [isSuccess]);

	useEffect(() => {
		if (isError) {
			notifications.show({
				title: "Error",
				message: "An unexpected error occurred. Please try again.",
				color: "red",
			});
		}
	});

	if (user) {
		return (
			<>
				<Drawer
					opened={drawerOpened}
					onClose={drawerClose}
					title="Edit User"
					size="30rem"
					position="right"
				>
					<EditUser id={userId} closeDrawer={drawerClose} />
				</Drawer>
				<Table.Tr>
					<Table.Td>{`${user.firstname} ${user.lastname}`}</Table.Td>
					<Table.Td>{user.email}</Table.Td>
					<Table.Td>{user.phone}</Table.Td>
					<Table.Td>{user.userType}</Table.Td>
					<Table.Td>{user.status}</Table.Td>
					<Table.Td>
						<ActionIcon variant="light" color="gray" onClick={drawerOpen}>
							<img src="/images/edit.svg" alt="edit" style={{ width: "70%" }} />
						</ActionIcon>
						<ActionIcon
							variant="filled"
							color="red"
							style={{ marginLeft: "1rem" }}
							onClick={async () => await deleteUser({ id: user.id })}
						>
							<img
								src="/images/delete.svg"
								alt="delete"
								style={{ width: "70%" }}
							/>
						</ActionIcon>
					</Table.Td>
				</Table.Tr>
			</>
		);
	} else {
		return null;
	}
};

const memoizedUser = memo(User);

export default memoizedUser;
