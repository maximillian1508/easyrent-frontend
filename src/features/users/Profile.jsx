import {
	Button,
	Grid,
	LoadingOverlay,
	NumberInput,
	PasswordInput,
	TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import { useGetUsersQuery, useUpdateUserMutation } from "./usersApiSlice";

const Profile = () => {
	useTitle("Profile");
	const { userId } = useAuth();
	const { user, isFetching } = useGetUsersQuery("usersList", {
		selectFromResult: ({ data, isLoading }) => ({
			user: data?.entities[userId],
			isFetching: isLoading,
		}),
	});

	const [formData, setFormData] = useState({
		id: userId,
		firstname: "",
		lastname: "",
		email: "",
		phone: "",
		userType: "",
	});

	const [errors, setErrors] = useState({});

	const [updateUser, { isLoading, isSuccess, isError, error }] =
		useUpdateUserMutation();

	useEffect(() => {
		if (user) {
			setFormData({
				id: userId,
				firstname: user.firstname,
				lastname: user.lastname,
				email: user.email,
				phone: user.phone,
				userType: user.userType,
			});
		}
	}, [user, userId]);

	useEffect(() => {
		if (isSuccess) {
			notifications.show({
				title: "Success",
				message: "Profile updated successfully",
				color: "green",
			});
		}
	}, [isSuccess]);

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

	if (isFetching) {
		return <LoadingOverlay visible={true} />;
	}

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

		
		await updateUser({ ...formData, id: user._id });
	};

	return (
		<main className="main-container">
			<section>
				<div className="main-upper-section">
					<h1>Profile</h1>
				</div>
				<section className="bordered-container">
					<h2>Personal Details</h2>
					<form
						onSubmit={handleSubmit}
						style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
					>
						<Grid>
							<Grid.Col span={{ base: 12, sm: 6 }}>
								<TextInput
									label="First Name"
									name="firstname"
									onChange={handleChange}
									error={errors.firstname}
									value={formData.firstname}
								/>
							</Grid.Col>
							<Grid.Col span={{ base: 12, sm: 6 }}>
								<TextInput
									label="Last Name"
									name="lastname"
									onChange={handleChange}
									error={errors.lastname}
									value={formData.lastname}
								/>
							</Grid.Col>
							<Grid.Col span={{ base: 12, sm: 6 }}>
								<TextInput
									label="Email"
									name="email"
									onChange={handleChange}
									error={errors.email}
									value={formData.email}
								/>
							</Grid.Col>
							<Grid.Col span={{ base: 12, sm: 6 }}>
								<NumberInput
									label="Phone"
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
							<Grid.Col span={12}>
								<PasswordInput
									label="Password"
									placeholder="Enter a new password"
									name="password"
									onChange={handleChange}
									error={errors.password}
								/>
							</Grid.Col>
							<Grid.Col span={12}>
								<Button
									variant="er-blue"
									w="100%"
									type="submit"
									loading={isLoading}
								>
									Update Profile
								</Button>
							</Grid.Col>
						</Grid>
					</form>
				</section>
			</section>
		</main>
	);
};

export default Profile;
