import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";
import { ActionIcon, Button, Divider, Menu, ThemeIcon } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useEffect, useRef, useState } from "react";
import { NavHashLink } from "react-router-hash-link";
import { useSendLogoutMutation } from "../../features/auth/authApiSlice";
import useAuth from "../../hooks/useAuth";

const Header = () => {
	const location = useLocation();
	const [iconSrc, setIconSrc] = useState("images/er-horizontal-white.svg");
	const [loginVariant, setLoginVariant] = useState("er-white");
	const ref = useRef();
	const { isCustomer, userName } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (location.pathname === "/") {
			setLoginVariant("er-white");
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

		return () => {};
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
			<aside className="logo-sect">
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
			</nav>
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
							<Menu.Item
								component="a"
								href="/dashboard"
								leftSection={
									<ThemeIcon variant="transparent">
										<img
											src="/images/dashboard.svg"
											alt="dashboard"
											width="70%"
										/>
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
						</Menu.Dropdown>
					</Menu>
				</div>
			) : (
				<nav className="nav-section">
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
				</nav>
			)}
		</header>
	);
	return (
		<>
			{content}
			{location.pathname !== "/" && <div className="header-spacer" />}
		</>
	);
};
export default Header;
