import {
	ActionIcon,
	Button,
	FileInput,
	Grid,
	LoadingOverlay,
	Modal,
	NumberInput,
	ScrollArea,
	Select,
	Table,
	TextInput,
	Textarea,
	ThemeIcon,
	Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAddNewPropertyMutation } from "./propertiesApiSlice";

const AddNewProperty = () => {
	const [formData, setFormData] = useState({
		name: "",
		type: "Unit Rental",
		address: "",
		description: "",
		images: [],
		rooms: [],
		price: "",
		depositAmount: "",
	});
	const [roomData, setRoomData] = useState({
		name: "",
		price: "",
		deposit: "",
		description: "",
	});
	const [errors, setErrors] = useState({});
	const [addNewProperty, { isLoading, isSuccess, isError, error }] =
		useAddNewPropertyMutation();
	const [modalOpened, { open: modalOpen, close: modalClose }] =
		useDisclosure(false);

	const navigate = useNavigate();

	const handleChange = (e) => {
		const { value, name } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
		// Clear the error for this field when the user starts typing
		setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
	};

	const handleFileChange = (files) => {
		setFormData((prev) => ({ ...prev, images: files }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrors({});

		
		await addNewProperty(formData);
	};

	useEffect(() => {
		if (isSuccess) {
			setFormData({
				name: "",
				type: "Unit Rental",
				address: "",
				description: "",
				images: [],
				rooms: [],
				price: "",
				depositAmount: "",
			});
			notifications.show({
				title: "Success",
				message: "Property added successfully",
				color: "green",
			});
			navigate("/manage-properties");
		}
	}, [isSuccess, navigate]);

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

	const unitRentalInformation = (
		<section
			className="bordered-container"
			style={{ width: "100%", gap: "1rem" }}
		>
			<Title order={2} size="h4">
				Unit Rental Information
			</Title>
			<div className="form-row">
				<div className="form-row-label">
					<label style={{ fontWeight: "500", color: "dimgrey" }}>
						Rental Price
					</label>
					<ThemeIcon
						variant="light"
						color="gray"
						style={{
							width: "fit-content",
							marginLeft: "0.5rem",
							fontSize: "0.8rem",
							fontWeight: "500",
						}}
					>
						Required
					</ThemeIcon>
				</div>
				<div className="form-row-input">
					<NumberInput
						placeholder="Enter the rental price in RM"
						min={1}
						clampBehavior="strict"
						max={100000}
						prefix="RM"
						allowNegative={false}
						allowDecimal={false}
						hideControls
						name="price"
						onChange={(e) => {
							setFormData({ ...formData, price: e });
							setErrors((prevErrors) => ({ ...prevErrors, price: "" }));
						}}
						error={errors.price}
						required
					/>
				</div>
			</div>
			<div className="form-row">
				<div className="form-row-label">
					<label style={{ fontWeight: "500", color: "dimgrey" }}>
						Deposit Amount
					</label>
					<ThemeIcon
						variant="light"
						color="gray"
						style={{
							width: "fit-content",
							marginLeft: "0.5rem",
							fontSize: "0.8rem",
							fontWeight: "500",
						}}
					>
						Required
					</ThemeIcon>
				</div>
				<div className="form-row-input">
					<NumberInput
						placeholder="Enter the deposit amount in RM"
						min={1}
						clampBehavior="strict"
						max={100000}
						prefix="RM"
						allowNegative={false}
						allowDecimal={false}
						hideControls
						name="depositAmount"
						onChange={(e) => {
							setFormData({ ...formData, depositAmount: e });
							setErrors((prevErrors) => ({
								...prevErrors,
								depositAmount: "",
							}));
						}}
						error={errors.depositAmount}
						required
					/>
				</div>
			</div>
		</section>
	);

	const roomRentalInformation = (
		<section
			className="bordered-container"
			style={{ width: "100%", gap: "1rem" }}
		>
			<Modal
				opened={modalOpened}
				onClose={modalClose}
				title="Add New Room"
				size="lg"
				centered
			>
				<Grid>
					<Grid.Col span={12}>
						<TextInput
							label="Name"
							placeholder="Enter room name"
							name="name"
							onChange={(e) => {
								setRoomData({ ...roomData, name: e.target.value });
							}}
							required
						/>
					</Grid.Col>
					<Grid.Col span={{ base: 12, sm: 6 }}>
						<NumberInput
							label="Price"
							placeholder="Enter room price"
							name="price"
							onChange={(value) => {
								setRoomData({ ...roomData, price: value });
							}}
							required
							min={1}
							clampBehavior="strict"
							max={100000}
							prefix="RM"
							allowNegative={false}
							allowDecimal={false}
							hideControls
						/>
					</Grid.Col>
					<Grid.Col span={{ base: 12, sm: 6 }}>
						<NumberInput
							label="Deposit Amount"
							placeholder="Enter room deposit amount"
							name="DepositAmount"
							onChange={(value) => {
								setRoomData({ ...roomData, depositAmount: value });
							}}
							required
							min={1}
							clampBehavior="strict"
							max={100000}
							prefix="RM"
							allowNegative={false}
							allowDecimal={false}
							hideControls
						/>
					</Grid.Col>
					<Grid.Col span={12}>
						<TextInput
							label="Description"
							placeholder="Enter room description"
							name="description"
							onChange={(e) => {
								setRoomData({ ...roomData, description: e.target.value });
							}}
						/>
					</Grid.Col>
				</Grid>
				<Button
					onClick={() => {
						setFormData((prevData) => ({
							...prevData,
							rooms: [...prevData.rooms, roomData],
						}));
						setRoomData({
							name: "",
							price: "",
							depositAmount: "",
							description: "",
						});
						modalClose();
						notifications.show({
							title: "Success",
							message: "Room added",
							color: "green",
						});
					}}
					w="100%"
					variant="er-blue"
					mt="1rem"
				>
					Submit Room
				</Button>
			</Modal>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between",
					marginBottom: "1rem",
				}}
			>
				<Title order={2} size="h4">
					Room Rental Information
				</Title>
				<Button variant="er-blue" type="button" onClick={modalOpen}>
					Add Room
				</Button>
			</div>
			<div style={{ flex: "1", minHeight: "0" }}>
				<ScrollArea h="100%">
					<Table highlightOnHover>
						<Table.Thead>
							<Table.Tr>
								<Table.Th>#</Table.Th>
								<Table.Th>Name</Table.Th>
								<Table.Th>Price</Table.Th>
								<Table.Th>Deposit</Table.Th>
								<Table.Th>Description</Table.Th>
								<Table.Th />
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							{formData.rooms.map((room, index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								<Table.Tr key={index + 1}>
									<Table.Td>{index + 1}</Table.Td>
									<Table.Td>{room.name}</Table.Td>
									<Table.Td>{room.price}</Table.Td>
									<Table.Td>{room.depositAmount}</Table.Td>
									<Table.Td>{room.description || ""}</Table.Td>
									<Table.Td>
										<ActionIcon
											variant="filled"
											color="red"
											style={{ marginLeft: "1rem" }}
											onClick={() => {
												setFormData((prevData) => ({
													...prevData,
													rooms: prevData.rooms.filter(
														(_, roomIndex) => roomIndex !== index,
													),
												}));
											}}
										>
											<img
												src="/images/delete.svg"
												alt="delete"
												style={{ width: "70%" }}
											/>
										</ActionIcon>
									</Table.Td>
								</Table.Tr>
							))}
						</Table.Tbody>
					</Table>
				</ScrollArea>
			</div>
		</section>
	);

	return (
		<main className="main-container">
			<section style={{ position: "relative" }}>
				<LoadingOverlay
					visible={isLoading}
					loaderProps={{ color: "blue", type: "oval" }}
				/>
				<div className="main-upper-section">
					<h1>Add New Property</h1>
				</div>
				<form
					onSubmit={handleSubmit}
					style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
				>
					<section className="bordered-container" style={{ width: "100%" }}>
						<div className="form-row" style={{ alignItems: "center" }}>
							<div className="form-row-label">
								<label style={{ fontWeight: "500" }}>Property Type</label>
							</div>
							<div className="form-row-input">
								<Select
									name="type"
									data={["Unit Rental", "Room Rental"]}
									onChange={(_value, option) => {
										setFormData({
											...formData,
											type: option?.value || "Unit Rental",
											price: "",
											depositAmount: "",
											rooms: [],
										});
									}}
									allowDeselect={false}
									defaultValue="Unit Rental"
									required
								/>
							</div>
						</div>
					</section>
					<section
						className="bordered-container"
						style={{ width: "100%", gap: "1rem" }}
					>
						<Title order={2} size="h4">
							Property Information
						</Title>
						<div className="form-row">
							<div className="form-row-label">
								<label style={{ fontWeight: "500", color: "dimgrey" }}>
									Property Name
								</label>
								<ThemeIcon
									variant="light"
									color="gray"
									style={{
										width: "fit-content",
										marginLeft: "0.5rem",
										fontSize: "0.8rem",
										fontWeight: "500",
									}}
								>
									Required
								</ThemeIcon>
							</div>
							<div className="form-row-input">
								<TextInput
									placeholder="Enter property name (e.g. Apartment Name, Floor, etc.)"
									onChange={handleChange}
									error={errors.name}
									name="name"
									required
								/>
							</div>
						</div>
						<div className="form-row">
							<div className="form-row-label">
								<label style={{ fontWeight: "500", color: "dimgrey" }}>
									Property Address
								</label>
								<ThemeIcon
									variant="light"
									color="gray"
									style={{
										width: "fit-content",
										marginLeft: "0.5rem",
										fontSize: "0.8rem",
										fontWeight: "500",
									}}
								>
									Required
								</ThemeIcon>
							</div>
							<div className="form-row-input">
								<TextInput
									placeholder="Enter property address"
									onChange={handleChange}
									error={errors.address}
									name="address"
									required
								/>
							</div>
						</div>
						<div className="form-row">
							<div className="form-row-label">
								<label style={{ fontWeight: "500", color: "dimgrey" }}>
									Property Description
								</label>
								<ThemeIcon
									variant="light"
									color="gray"
									style={{
										width: "fit-content",
										marginLeft: "0.5rem",
										fontSize: "0.8rem",
										fontWeight: "500",
									}}
								>
									Required
								</ThemeIcon>
							</div>
							<div className="form-row-input">
								<Textarea
									onChange={handleChange}
									error={errors.description}
									name="description"
									placeholder="Enter property description (e.g. Bedrooms, Bathrooms, Amenities, etc.)"
									required
									maxRows={5}
								/>
							</div>
						</div>
						<div className="form-row">
							<div className="form-row-label">
								<label style={{ fontWeight: "500", color: "dimgrey" }}>
									Property Image
								</label>
							</div>
							<div className="form-row-input">
								<FileInput
									accept="image/png,image/jpeg,image/jpg"
									placeholder="Add property image"
									onChange={handleFileChange}
									name="images"
									multiple
									clearable
								/>
							</div>
						</div>
					</section>
					{formData.type === "Unit Rental"
						? unitRentalInformation
						: roomRentalInformation}
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "end",
							gap: "1rem",
						}}
					>
						<Button
							variant="outline"
							color="gray"
							component="a"
							href="/manage-properties"
						>
							Cancel
						</Button>
						<Button variant="er-blue" type="submit">
							Add Property
						</Button>
					</div>
				</form>
			</section>
		</main>
	);
};

export default AddNewProperty;
