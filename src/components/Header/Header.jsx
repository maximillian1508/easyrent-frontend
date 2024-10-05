import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";
import {
	ActionIcon,
	Button,
	Divider,
	Menu,
	ThemeIcon,
	Burger,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useEffect, useRef, useState } from "react";
import { NavHashLink } from "react-router-hash-link";
import { useSendLogoutMutation } from "../../features/auth/authApiSlice";
import useAuth from "../../hooks/useAuth";


const Header = () => {
	const [opened, { toggle }] = useDisclosure();
	const location = useLocation();
	const [iconSrc, setIconSrc] = useState("images/er-horizontal-white.svg");
	const [loginVariant, setLoginVariant] = useState("er-white");
	const ref = useRef();
	const { isCustomer, userName } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (location.pathname === "/") {
			setLoginVariant("er-white");
			setIconSrc("/images/er-horizontal-white.svg");
			const handleScroll = () => {
				if (ref.current) {
					const scrollTop = window.scrollY;
					const offset = 50;

					if (scrollTop > offset) {
						ref.current.classList.add("whitebar");
						setLoginVariant("er-blue");
						setIconSrc("/images/er-horizontal.svg");
					} else {
						ref.current.classList.remove("whitebar");
						setLoginVariant("er-white");
						setIconSrc("/images/er-horizontal-white.svg");
					}
				}
			};

			window.addEventListener("scroll", handleScroll);
			return () => {
				window.removeEventListener("scroll", handleScroll);
			};
		}
		setLoginVariant("er-blue");

		return () => { };
	}, [location.pathname]);

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

	const content = (
		<header
			className={location.pathname === "/" ? "topbar" : "topbar whitebar"}
			ref={ref}
		>
			<aside className="logo-sect" style={{ flexShrink: 0 }}>
				<Link to="/">
					<img
						src={
							location.pathname === "/" ? iconSrc : "/images/er-horizontal.svg"
						}
						alt="Easyrent"
					/>
				</Link>
			</aside>
			<nav className="nav-section">
				<ul>
					<li>
						<NavHashLink to="/#">Home</NavHashLink>
					</li>
					<li>
						<NavHashLink to="/listing#">Listing</NavHashLink>
					</li>
					<li>
						<NavHashLink to="/faq#">FAQ</NavHashLink>
					</li>
					<li>
						<NavHashLink to="/about-us#">About Us</NavHashLink>
					</li>
				</ul>
				{isCustomer ? (
					<div className="inner-dash-topbar">
						<ActionIcon variant="white">
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
									variant="white"
									color="gray"
									leftSection={
										<ThemeIcon variant="white" color="gray">
											<img
												src="/images/user-hair.svg"
												style={{ width: "70%", height: "70%" }}
												alt="user hair"
											/>
										</ThemeIcon>
									}
									styles={{
										label: { overflow: "ellipsis" },
										root: { width: "150px" },
									}}
								>
									{userName}
								</Button>
							</Menu.Target>
							<Menu.Dropdown>
								<Menu.Label>Application</Menu.Label>
								<Menu.Item
									leftSection={
										<ThemeIcon variant="transparent">
											<img src="/images/user.svg" alt="user" width="70%" />
										</ThemeIcon>
									}
								>
									Profile
								</Menu.Item>
								<Menu.Item
									component="a"
									href="/dashboard"
									leftSection={
										<ThemeIcon variant="transparent">
											<img src="/images/dashboard.svg" alt="dashboard" width="70%" />
										</ThemeIcon>
									}
								>
									Enter Dashboard
								</Menu.Item>
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
								</Menu.Item>							</Menu.Dropdown>
						</Menu>
					</div>
				) : (
					<ul>
						<li>
							<NavLink to="/register#">Register</NavLink>
						</li>
						<li>
							<Button
								variant={loginVariant}
								styles={{ label: { overflow: "visible" } }}
								component="a"
								href="/login#"
								radius="lg"
							>
								Login
							</Button>
						</li>
					</ul>
				)}
			</nav>
			<nav className="mobile-nav-section">
				<Menu
					shadow="md"
					width={200}
					styles={{
						dropdown: {
							width: "100vw",
							left: "0px",
							position: "absolute",
						},
						itemLabel: {
							fontSize: "1.25em"
						}
					}}
					offset={0}
					onPositionChange={toggle}
				>
					<Menu.Target>
						<Button
							variant="white"
							color="gray"
							leftSection={
								<ThemeIcon variant="white" color="gray">
									<Burger opened={opened} onClick={toggle} aria-label="Toggle navigation" />
								</ThemeIcon>
							}
							styles={{
								section: { margin: "0px", padding: "0 5px" },
								root: {
									padding: "0px",
								},
							}}
						/>
					</Menu.Target>

					<Menu.Dropdown>
						<Menu.Item component="a" href="/">
							Home
						</Menu.Item>
						<Menu.Item component="a" href="/listing">
							Listing
						</Menu.Item>
						<Menu.Item component="a" href="/faq">
							FAQ
						</Menu.Item>
						<Menu.Item component="a" href="/about-us">
							About Us
						</Menu.Item>
						<Menu.Divider />
						{isCustomer ? (
							<>
								<Menu.Label>Application</Menu.Label>
								<Menu.Item
									leftSection={
										<ThemeIcon variant="transparent">
											<img src="/images/user.svg" alt="user" width="70%" />
										</ThemeIcon>
									}
								>
									Profile
								</Menu.Item>
								<Menu.Item
									component="a"
									href="/dashboard"
									leftSection={
										<ThemeIcon variant="transparent">
											<img src="/images/dashboard.svg" alt="dashboard" width="70%" />
										</ThemeIcon>
									}
								>
									Enter Dashboard
								</Menu.Item>
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
							</>
						) : (
							<>
								<Menu.Item component="a" href="/login">
									Login
								</Menu.Item>
								<Menu.Item component="a" href="/register">
									Register
								</Menu.Item>
							</>
						)
						}
					</Menu.Dropdown>
				</Menu>
			</nav >
		</header >
	);
	return (
		<>
			{content}
			{location.pathname !== "/" && <div className="header-spacer" />}
		</>
	);
};
export default Header;
