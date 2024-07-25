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
		label: "Application",
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
	{
		label: "Contract",
		href: "/contract",
		leftSection: (
			<ThemeIcon variant="transparent">
				<img
					src="/images/contract.svg"
					style={{ width: "80%" }}
					alt="contract"
				/>
			</ThemeIcon>
		),
	},
	{
		label: "Payment",
		href: "/payment",
		leftSection: (
			<ThemeIcon variant="transparent">
				<img src="/images/payment.svg" style={{ width: "80%" }} alt="payment" />
			</ThemeIcon>
		),
	},
	{
		label: "Complaint",
		href: "/complaint",
		leftSection: (
			<ThemeIcon variant="transparent">
				<img
					src="/images/complaint.svg"
					style={{ width: "80%" }}
					alt="complaint"
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
		label: "Users",
		href: "/manage-users",
		leftSection: (
			<ThemeIcon variant="transparent">
				<img src="/images/users.svg" style={{ width: "70%" }} alt="users" />
			</ThemeIcon>
		),
	},
	{
		label: "Properties",
		href: "/manage-properties",
		leftSection: (
			<ThemeIcon variant="transparent">
				<img
					src="/images/property.svg"
					style={{ width: "70%" }}
					alt="properties"
				/>
			</ThemeIcon>
		),
	},
	{
		label: "Contracts",
		href: "/manage-contracts",
		leftSection: (
			<ThemeIcon variant="transparent">
				<img
					src="/images/contract.svg"
					style={{ width: "70%" }}
					alt="contracts"
				/>
			</ThemeIcon>
		),
	},
	{
		label: "Transactions",
		href: "/manage-transactions",
		leftSection: (
			<ThemeIcon variant="transparent">
				<img
					src="/images/transaction.svg"
					style={{ width: "70%" }}
					alt="transactions"
				/>
			</ThemeIcon>
		),
	},
	{
		label: "Complaints",
		href: "/manage-complaints",
		leftSection: (
			<ThemeIcon variant="transparent">
				<img
					src="/images/complaint.svg"
					style={{ width: "70%" }}
					alt="complaints"
				/>
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
