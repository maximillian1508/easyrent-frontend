import {
	ActionIcon,
	Button,
	Divider,
	Drawer,
	Menu,
	Text,
	ThemeIcon,
	Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSendLogoutMutation } from "../../features/auth/authApiSlice";
import "./Sidebar.css";
import { HashLink } from "react-router-hash-link";
import useAuth from "../../hooks/useAuth";
import useGetTitle from "../../hooks/useGetTitle";
import SideNavigation from "./SideNavigation";

const Sidebar = () => {
	const [opened, { open, close }] = useDisclosure(false);
	const navigate = useNavigate();
	const { userName, isCustomer } = useAuth();
	const location = useLocation();

	const title = useGetTitle();

	const [sendLogout, { isError, error }] = useSendLogoutMutation();

	const logout = async () => {
		try {
			await sendLogout().unwrap();
			notifications.show({
				title: "Success",
				message: "Successfully logged out",
				color: "Green",
			});
			navigate("/");
		} catch (err) {
			notifications.show({
				title: "Error",
				message: err.data?.message,
				color: "Red",
			});
		}
	};

	if (isError) {
		console.log(error);
		notifications.show({
			title: "Error",
			message: error.data?.message,
			color: "Red",
		});
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		close();
	}, [location.pathname, close]);

	return (
		<header className="dash-topbar">
			<Drawer.Root opened={opened} onClose={close} size="250px">
				<Drawer.Overlay />
				<Drawer.Content>
					<Drawer.Header>
						<Drawer.Title>
							<div>
								<img
									src="/images/er-horizontal.svg"
									alt="easyrent"
									width="75%"
								/>
							</div>
						</Drawer.Title>
						<Drawer.CloseButton />
					</Drawer.Header>
					<Drawer.Body>
						<Divider size="sm" mb="1rem" />
						<nav>
							<ul>
								<SideNavigation />
							</ul>
						</nav>
					</Drawer.Body>
				</Drawer.Content>
			</Drawer.Root>
			<div className="inner-dash-topbar">
				<ActionIcon
					variant="outline"
					color="gray"
					aria-label="Sidebar"
					onClick={open}
					size={35}
				>
					<img
						src="/images/burger-bar.svg"
						alt="burger bar"
						style={{ width: "60%", height: "60%" }}
					/>
				</ActionIcon>
				<HashLink to="/dashboard" style={{ width: "40px", height: "40px" }}>
					<img src="/images/er-circle.svg" alt="easyrent logo" width="100%" />
				</HashLink>
				<Title order={1} size="h3" fw="500">
					{title}
				</Title>
			</div>
			<div className="inner-dash-topbar">
				<ActionIcon variant="outline" color="gray">
					<img
						src="/images/notifications.svg"
						alt="notifications"
						width="70%"
					/>
				</ActionIcon>
				<Divider orientation="vertical" size="sm" />
				<Menu shadow="md" width={200}>
					<Menu.Target>
						<Button
							variant="subtle"
							color="gray"
							leftSection={
								<ThemeIcon variant="transparent">
									<img
										src="/images/user-hair.svg"
										style={{ width: "70%", height: "70%" }}
										alt="user hair"
									/>
								</ThemeIcon>
							}
							styles={{
								root: { width: "175px" },
							}}
						>
							<Text truncate="end">{userName}</Text>
						</Button>
					</Menu.Target>

					<Menu.Dropdown>
						<Menu.Label>Application</Menu.Label>
						<Menu.Item
							leftSection={
								<ThemeIcon variant="transparent">
									<img src="/images/user.svg" alt="profile" width="70%" />
								</ThemeIcon>
							}
						>
							Profile
						</Menu.Item>
						<Menu.Item
							leftSection={
								<ThemeIcon variant="transparent">
									<img
										src="/images/notifications.svg"
										alt="notifications"
										width="70%"
									/>
								</ThemeIcon>
							}
						>
							Notifications
						</Menu.Item>
						<Menu.Item
							leftSection={
								<ThemeIcon variant="transparent">
									<img src="/images/setting.svg" alt="setting" width="70%" />
								</ThemeIcon>
							}
						>
							Setting
						</Menu.Item>
						{isCustomer && (
							<Menu.Item
								component="a"
								href="/"
								leftSection={
									<ThemeIcon variant="transparent">
										<img src="/images/exit.svg" alt="exit" width="70%" />
									</ThemeIcon>
								}
							>
								Exit Dashboard
							</Menu.Item>
						)}
						<Menu.Divider />

						<Menu.Label>Danger zone</Menu.Label>

						<Menu.Item
							color="red"
							onClick={logout}
							component="button"
							type="button"
							leftSection={
								<ThemeIcon variant="transparent">
									<img src="/images/logout.svg" alt="logout" width="70%" />
								</ThemeIcon>
							}
						>
							Logout
						</Menu.Item>
					</Menu.Dropdown>
				</Menu>
			</div>
		</header>
	);
};

export default Sidebar;
