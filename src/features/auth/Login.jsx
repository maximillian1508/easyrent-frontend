import {
	Button,
	Checkbox,
	Grid,
	PasswordInput,
	TextInput,
	Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import usePersist from "../../hooks/usePersist";
import useTitle from "../../hooks/useTitle";
import { useLoginMutation } from "./authApiSlice";
import { setCredentials } from "./authSlice";

const Login = () => {
	useTitle("Login");

	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [errors, setErrors] = useState({});
	const [persist, setPersist] = usePersist();

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [login, { isLoading }] = useLoginMutation();

	const errorNotif = (message) => {
		notifications.show({
			title: "Error",
			message: message,
			color: "Red",
		});
	};

	const handleToggle = () => setPersist(true);

	const handleChange = (e) => {
		const { value, name } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
		// Clear the error for this field when the user starts typing
		setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const { accessToken } = await login({ ...formData }).unwrap();
			dispatch(setCredentials({ accessToken }));
			setFormData({ email: "", password: "" });
			navigate("/dashboard");
			notifications.show({
				title: "Success",
				message: "Login Successful",
				color: "green",
			});
		} catch (err) {
			if (err.data?.message) {
				errorNotif(err.data?.message);
			} else {
				errorNotif("Something went wrong. Please try again.");
			}
		}
	};

	return (
		<main style={{ textAlign: "center", margin: "2rem 0" }}>
			<Title order={1}>Login</Title>
			<p className="heading-info" style={{ fontSize: "1rem" }}>
				Login to your account to start your rental journey with us.
			</p>
			<form
				className="bordered-center-form"
				onSubmit={handleSubmit}
				style={{ width: "40%" }}
			>
				<Grid style={{ marginBottom: "1rem" }}>
					<Grid.Col span={12}>
						<TextInput
							label="Email"
							placeholder="Enter your email"
							name="email"
							onChange={handleChange}
							error={errors.email}
							required
						/>
					</Grid.Col>
					<Grid.Col span={{ base: 12 }}>
						<PasswordInput
							label="Password"
							placeholder="Enter your password"
							name="password"
							onChange={handleChange}
							error={errors.password}
							required
						/>
					</Grid.Col>
				</Grid>
				{errors.general && (
					<p style={{ color: "red", marginBottom: "1rem" }}>{errors.general}</p>
				)}
				<Button variant="er-blue" w="100%" type="submit" loading={isLoading}>
					Login
				</Button>
				<Checkbox
					id="persist"
					label="Trust this device"
					onChange={handleToggle}
					size="md"
					mt="1rem"
				/>

				<p style={{ textAlign: "center", marginTop: "1rem" }}>
					Don&apos;t have an account?{" "}
					<Link
						to="/register"
						style={{ color: "#000", textDecoration: "underline" }}
					>
						Register
					</Link>
				</p>

				<p style={{ textAlign: "center", marginTop: "1rem" }}>
					<Link to="/" style={{ color: "#000", textDecoration: "underline" }}>
						Back to Home Page
					</Link>
				</p>
			</form>
		</main>
	);
};

export default Login;
