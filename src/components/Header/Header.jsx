import { Link, NavLink, useLocation } from "react-router-dom";
import "./Header.css";
import { Button } from "@mantine/core";
import { useEffect, useRef, useState } from "react";

function Header() {
	const location = useLocation();
	const [iconSrc, setIconSrc] = useState("images/er-horizontal-white.svg");
	const [loginVariant, setLoginVariant] = useState("er-white");
	const ref = useRef();

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
						setIconSrc("images/er-horizontal.svg");
					} else {
						ref.current.classList.remove("whitebar");
						setLoginVariant("er-white");
						setIconSrc("images/er-horizontal-white.svg");
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

	const content = (
		<header
			className={location.pathname === "/" ? "topbar" : "topbar whitebar"}
			ref={ref}
		>
			<aside className="logo-sect">
				<Link to="/">
					<img
						src={
							location.pathname === "/" ? iconSrc : "images/er-horizontal.svg"
						}
						alt="Easyrent"
					/>
				</Link>
			</aside>
			<nav className="nav-section">
				<ul>
					<li>
						<NavLink to="/">Home</NavLink>
					</li>
					<li>
						<NavLink to="/listing">Listing</NavLink>
					</li>
					<li>
						<NavLink to="/faq">FAQ</NavLink>
					</li>
					<li>
						<NavLink to="/about-us">About Us</NavLink>
					</li>
				</ul>
			</nav>
			<nav className="nav-section">
				<ul>
					<li>
						<NavLink to="/register">Register</NavLink>
					</li>
					<li>
						<Button
							variant={loginVariant}
							styles={{ label: { overflow: "visible" } }}
							component="a"
							href="/login"
							radius="lg"
						>
							Login
						</Button>
					</li>
				</ul>
			</nav>
		</header>
	);
	return (
		<>
			{content}
			{location.pathname !== "/" && <div className="header-spacer" />}
		</>
	);
}
export default Header;
