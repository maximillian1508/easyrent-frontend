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
import { useGetUsersQuery, useUpdateUserMutation } from "./usersApiSlice";

const EditUser = ({ id, closeDrawer }) => {
	const { user } = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			user: data?.entities[id],
		}),
	});

	//const user = useSelector((state) => selectUserById(state, id));

	const [formData, setFormData] = useState({
		id: user.id,
		firstname: user.firstname,
		lastname: user.lastname,
		email: user.email,
		phone: user.phone,
		userType: user.userType,
	});
	const [errors, setErrors] = useState({});

	const [updateUser, { isLoading, isSuccess, isError, error }] =
		useUpdateUserMutation();

	useEffect(() => {
		if (isSuccess) {
			notifications.show({
				title: "Success",
				message: "User updated successfully",
				color: "green",
			});
			closeDrawer();
		}
	}, [isSuccess, closeDrawer]);

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
		await updateUser({ ...formData, id: user.id });
	};

	return (
		<form onSubmit={handleSubmit}>
			<Grid style={{ marginBottom: "1rem" }}>
				<Grid.Col span={{ base: 12, sm: 6 }}>
					<TextInput
						label="First Name"
						placeholder={user.firstname}
						name="firstname"
						onChange={handleChange}
						error={errors.firstname}
						value={formData.firstname}
					/>
				</Grid.Col>
				<Grid.Col span={{ base: 12, sm: 6 }}>
					<TextInput
						label="Last Name"
						placeholder={user.lastname}
						name="lastname"
						onChange={handleChange}
						error={errors.lastname}
						value={formData.lastname}
					/>
				</Grid.Col>
				<Grid.Col span={{ base: 12, sm: 6 }}>
					<TextInput
						label="Email"
						placeholder={user.email}
						name="email"
						onChange={handleChange}
						error={errors.email}
						value={formData.email}
					/>
				</Grid.Col>
				<Grid.Col span={{ base: 12, sm: 6 }}>
					<Select
						label="User Type"
						name="userType"
						placeholder={user.userType}
						data={[
							{ value: "customer", label: "Customer" },
							{ value: "admin", label: "Admin" },
						]}
						onChange={(_value, option) =>
							setFormData({
								...formData,
								userType: option?.value || "",
							})
						}
						value={formData.userType}
					/>
				</Grid.Col>
				<Grid.Col span={12}>
					<NumberInput
						label="Phone"
						placeholder={user.phone}
						name="phone"
						onChange={(e) => {
							setFormData({ ...formData, phone: e });
							setErrors((prevErrors) => ({ ...prevErrors, phone: "" }));
						}}
						value={formData.phone}
						error={errors.phone}
						hideControls
						allowNegative={false}
						allowDecimal={false}
					/>
				</Grid.Col>
				<Grid.Col span={{ base: 12, sm: 6 }}>
					<PasswordInput
						label="Password"
						placeholder="Enter a new password"
						name="password"
						onChange={handleChange}
						error={errors.password}
					/>
				</Grid.Col>
				<Grid.Col span={12}>
					<Button variant="er-blue" w="100%" type="submit" loading={isLoading}>
						Update User
					</Button>
				</Grid.Col>
			</Grid>
		</form>
	);
};

export default EditUser;
