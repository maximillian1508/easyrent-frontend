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
import { useAddNewComplaintMutation } from "./complaintsApiSlice";

const AddNewComplaint = ({ closeModal, userId }) => {
	const [addNewComplaint, { isLoading, isSuccess, isError, error }] =
		useAddNewComplaintMutation();
	const [errors, setErrors] = useState({});

	const [formData, setFormData] = useState({
		customer: userId,
		title: "",
		description: "",
	});

	useEffect(() => {
		if (isSuccess) {
			setFormData({
				customer: userId,
				title: "",
				description: "",
			});
			notifications.show({
				title: "Success",
				message: "Complaint added successfully",
				color: "green",
			});
			closeModal();
		}
	}, [isSuccess, closeModal, userId]);

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
		await addNewComplaint(formData);
	};
	return (
		<form onSubmit={handleSubmit}>
			<Grid>
				<Grid.Col span={12}>
					<TextInput
						label="Title"
						placeholder="Enter title"
						name="title"
						onChange={handleChange}
						error={errors.title}
						required
					/>
				</Grid.Col>
				<Grid.Col span={12}>
					<TextInput
						label="Description"
						placeholder="Enter description"
						name="description"
						onChange={handleChange}
						error={errors.description}
						required
					/>
				</Grid.Col>
				<Grid.Col span={12}>
					<Button
						variant="er-blue"
						w="100%"
						type="submit"
						loading={isLoading}
						disabled={formData.title === ""}
					>
						Add Complaint
					</Button>
				</Grid.Col>
			</Grid>
		</form>
	);
};

export default AddNewComplaint;
