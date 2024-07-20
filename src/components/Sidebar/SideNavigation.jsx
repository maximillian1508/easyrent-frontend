import { NavLink as MantineNavLink } from "@mantine/core";
import { ThemeIcon } from "@mantine/core";
import React from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const custNav = [
	{
		label: "Dashboard",
		href: "/dashboard",
		leftSection: (
			<ThemeIcon variant="transparent">
				<img
					src="/images/dashboard.svg"
					style={{ width: "70%" }}
					alt="dashboard"
				/>
			</ThemeIcon>
		),
	},
	{
		label: "Application History",
		href: "/application",
		leftSection: (
			<ThemeIcon variant="transparent">
				<img
					src="/images/apply.svg"
					style={{ width: "80%" }}
					alt="application"
				/>
			</ThemeIcon>
		),
	},
];

const adminNav = [
	{
		label: "Dashboard",
		href: "/dashboard",
		leftSection: (
			<ThemeIcon variant="transparent">
				<img
					src="/images/dashboard.svg"
					style={{ width: "70%" }}
					alt="dashboard"
				/>
			</ThemeIcon>
		),
	},
	{
		label: "Manage Users",
		href: "/manage-users",
		leftSection: (
			<ThemeIcon variant="transparent">
				<img src="/images/users.svg" style={{ width: "70%" }} alt="users" />
			</ThemeIcon>
		),
	},
];

const SideNavigation = () => {
	const { isCustomer, isAdmin } = useAuth();

	let navData;
	if (isCustomer) {
		navData = custNav;
	} else if (isAdmin) {
		navData = adminNav;
	}

	const navItems = navData.map((item) => (
		<li key={item.label}>
			<MantineNavLink
				label={item.label}
				leftSection={item.leftSection}
				styles={{
					label: {
						overflow: "ellipsis",
						fontSize: "1.1rem",
						fontWeight: "500",
					},
					root: {
						borderRadius: "7.5px",
					},
				}}
				variant="light"
				color="black"
				renderRoot={({ className, ...props }) => (
					<RouterNavLink to={item.href} className={className} {...props} />
				)}
			/>
		</li>
	));

	return <>{navItems}</>;
};

export default SideNavigation;
