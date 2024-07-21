import {
	Button,
	Grid,
	NumberInput,
	PasswordInput,
	Select,
	TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import React, { useState, useEffect } from "react";
import { useAddNewUserMutation } from "./usersApiSlice";

const AddNewUser = ({ closeModal }) => {
	const [addNewUser, { isLoading, isSuccess, isError, error }] =
		useAddNewUserMutation();
	const [errors, setErrors] = useState({});

	const [formData, setFormData] = useState({
		firstname: "",
		lastname: "",
		email: "",
		phone: "",
		userType: "customer",
		password: "",
		confirmPassword: "",
		status: "active",
	});

	useEffect(() => {
		if (isSuccess) {
			setFormData({
				firstname: "",
				lastname: "",
				email: "",
				phone: "",
				userType: "customer",
				password: "",
				confirmPassword: "",
				status: "active",
			});
			notifications.show({
				title: "Success",
				message: "User added successfully",
				color: "green",
			});
			closeModal();
		}
	}, [isSuccess, closeModal]);

	useEffect(() => {
		if (isError) {
			if (error?.data) {
				const { errors, errorFields } = error.data;
				if (errorFields) {
					setErrors(errorFields);
				} else if (errors) {
					const newErrors = {};
					for (const err of errors) {
						newErrors[err.field] = err.message;
					}
					setErrors(newErrors);
				} else {
					notifications.show({
						title: "Error",
						message: "An unexpected error occurred. Please try again.",
						color: "red",
					});
				}
			} else {
				notifications.show({
					title: "Error",
					message: "An unexpected error occurred. Please try again.",
					color: "red",
				});
			}
		}
	}, [isError, error]);

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
		setErrors({});

		console.log(formData);
		await addNewUser(formData);
	};

	return (
		<form onSubmit={handleSubmit}>
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
				<Grid.Col span={{ base: 12, sm: 6 }}>
					<TextInput
						label="Email"
						placeholder="Enter your email"
						name="email"
						onChange={handleChange}
						error={errors.email}
						required
					/>
				</Grid.Col>
				<Grid.Col span={{ base: 12, sm: 6 }}>
					<Select
						label="User Type"
						name="userType"
						data={[
							{ value: "customer", label: "Customer" },
							{ value: "admin", label: "Admin" },
						]}
						onChange={(_value, option) =>
							setFormData({
								...formData,
								userType: option?.value || "customer",
							})
						}
						allowDeselect={false}
						defaultValue="customer"
						required
					/>
				</Grid.Col>
				<Grid.Col span={12}>
					<NumberInput
						label="Phone"
						placeholder="Enter your phone"
						name="phone"
						onChange={(e) => {
							setFormData({ ...formData, phone: e });
							setErrors((prevErrors) => ({ ...prevErrors, phone: "" }));
						}}
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
				<Grid.Col span={12}>
					<Button variant="er-blue" w="100%" type="submit" loading={isLoading}>
						Add New User
					</Button>
				</Grid.Col>
			</Grid>
		</form>
	);
};

export default AddNewUser;
