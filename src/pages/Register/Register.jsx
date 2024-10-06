import {
	Button,
	Grid,
	NumberInput,
	PasswordInput,
	TextInput,
	Title,
} from "@mantine/core";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import useTitle from "../../hooks/useTitle";
import "./Register.css";
import axios from "axios";

const Register = () => {
	useTitle("Register");
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		firstname: "",
		lastname: "",
		email: "",
		phone: "",
		password: "",
		confirmPassword: "",
		userType: "customer",
		status: "pending",
	});

	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);

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
		setIsLoading(true);
		setErrors({});

		try {
			const response = await axios.post("/api/users", formData);
			console.log("Registration successful", response.data);
			navigate("/email-verification", {
				state: { email: formData.email },
			}); // Redirect to login page after successful registration
		} catch (error) {
			if (error.response?.data) {
				const { errors, errorFields } = error.response.data;
				if (errorFields) {
					setErrors(errorFields);
				} else if (errors) {
					const newErrors = {};
					for (const err of errors) {
						newErrors[err.field] = err.message;
					}
					setErrors(newErrors);
				} else {
					setErrors({
						general: "An unexpected error occurred. Please try again.",
					});
				}
			} else {
				setErrors({
					general: "An unexpected error occurred. Please try again.",
				});
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<main style={{ textAlign: "center", margin: "2rem 0" }}>
			<Title order={1}>Register</Title>
			<p className="heading-info register-info" style={{ fontSize: "1rem" }}>
				Create an account to start your rental journey with us.
			</p>
			<form className="bordered-center-form" onSubmit={handleSubmit}>
				<Grid style={{ marginBottom: "1rem" }}>
					<Grid.Col span={{ base: 12, sm: 6 }}>
						<TextInput
							label="First Name"
							placeholder="Enter your first name"
							name="firstname"
							onChange={handleChange}
							error={errors.firstname}
							required
						/>
					</Grid.Col>
					<Grid.Col span={{ base: 12, sm: 6 }}>
						<TextInput
							label="Last Name"
							placeholder="Enter your last name"
							name="lastname"
							onChange={handleChange}
							error={errors.lastname}
						/>
					</Grid.Col>
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
					<Grid.Col span={12}>
						<NumberInput
							label="Phone"
							placeholder="Enter your phone"
							name="phone"
							onChange={(e) => setFormData({ ...formData, phone: e })}
							error={errors.phone}
							required
							hideControls
							allowNegative={false}
							allowDecimal={false}
						/>
					</Grid.Col>
					<Grid.Col span={{ base: 12, sm: 6 }}>
						<PasswordInput
							label="Password"
							placeholder="Enter your password"
							name="password"
							onChange={handleChange}
							error={errors.password}
							required
						/>
					</Grid.Col>
					<Grid.Col span={{ base: 12, sm: 6 }}>
						<PasswordInput
							label="Confirm Password"
							placeholder="Confirm Your Password"
							name="confirmPassword"
							onChange={handleChange}
							error={errors.confirmPassword}
							required
						/>
					</Grid.Col>
				</Grid>
				{errors.general && (
					<p style={{ color: "red", marginBottom: "1rem" }}>{errors.general}</p>
				)}
				<Button variant="er-blue" w="100%" type="submit" loading={isLoading}>
					Register
				</Button>

				<p style={{ textAlign: "center", marginTop: "1rem" }}>
					Already have an account?{" "}
					<HashLink
						to="/login"
						style={{ color: "#000", textDecoration: "underline" }}
					>
						Login
					</HashLink>
				</p>

				<p style={{ textAlign: "center", marginTop: "1rem" }}>
					<HashLink
						to="/#"
						style={{ color: "#000", textDecoration: "underline" }}
					>
						Back to Home Page
					</HashLink>
				</p>
			</form>
		</main>
	);
};

export default Register;
