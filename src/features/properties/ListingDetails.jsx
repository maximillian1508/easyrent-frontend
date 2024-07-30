import { Carousel } from "@mantine/carousel";
import {
	Button,
	Image,
	Select,
	Spoiler,
	Text,
	ThemeIcon,
	Title,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import {
	useAddNewApplicationMutation,
	useGetActiveApplicationQuery,
	useGetUserRentalStatusQuery,
} from "../applications/applicationsApiSlice";
import { useGetPropertiesQuery } from "./propertiesApiSlice";

const ListingDetails = () => {
	useTitle("Property Details");
	const { userId } = useAuth();
	const { propertyId } = useParams();
	const { property } = useGetPropertiesQuery("propertiesList", {
		selectFromResult: ({ data }) => ({
			property: data?.entities[propertyId],
		}),
	});
	const {
		data: userStatus,
		isLoading: isStatusLoading,
		refetch: refetchUserStatus,
	} = useGetUserRentalStatusQuery(userId);

	const [formData, setFormData] = useState({
		user: userId,
		property: propertyId,
		room: property?.rooms.find((room) => !room.isOccupied)?._id || "",
		startDate: "",
		stayLength: "3",
	});

	const {
		data: activeApplication,
		isLoading: isActiveLoading,
		refetch: refetchActiveApplication,
	} = useGetActiveApplicationQuery(
		{
			propertyId,
			userId,
			roomId: property?.type === "Room Rental" ? formData.room : undefined,
		},
		{
			skip:
				!propertyId ||
				!userId ||
				(property?.type === "Room Rental" && !formData.room),
		},
	);

	const [errors, setErrors] = useState({});
	const [selectedRoom, setSelectedRoom] = useState(() => {
		const firstUnoccupiedIndex = property?.rooms.findIndex(
			(room) => !room.isOccupied,
		);
		return firstUnoccupiedIndex !== -1 ? firstUnoccupiedIndex : 0;
	});

	const [addNewApplication, { isLoading, isSuccess, isError, error }] =
		useAddNewApplicationMutation();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrors({});

		if (!userId) {
			notifications.show({
				title: "Error",
				message: "Please login to apply for this property.",
				color: "red",
			});
			return;
		}

		if (!activeApplication.canApply) {
			notifications.show({
				title: "Error",
				message:
					"You already have an application for this property. Please wait for the application to be responded.",
				color: "red",
			});
			return;
		}

		console.log(userStatus.canApply);

		if (!userStatus?.canApply) {
			notifications.show({
				title: "Error",
				message:
					"You cannot apply as you already have an active rental or accepted application.",
				color: "red",
			});
			return;
		}
		console.log(userId);
		console.log(formData);
		await addNewApplication(formData);
		refetchUserStatus();
		refetchActiveApplication();
	};

	useEffect(() => {
		setFormData((prevData) => ({ ...prevData, user: userId }));
	}, [userId]);

	useEffect(() => {
		if (property?.type === "Room Rental") {
			const firstUnoccupiedRoom = property.rooms.find(
				(room) => !room.isOccupied,
			);
			if (firstUnoccupiedRoom) {
				setFormData((prevData) => ({
					...prevData,
					room: firstUnoccupiedRoom._id,
				}));
				setSelectedRoom(
					property.rooms.findIndex(
						(room) => room._id === firstUnoccupiedRoom._id,
					),
				);
			}
		}
	}, [property]);

	useEffect(() => {
		if (isSuccess) {
			notifications.show({
				title: "Success",
				message: "Successfully Applied to this property!",
				color: "green",
			});
		}
	}, [isSuccess]);

	useEffect(() => {
		if (isError) {
			if (error?.status === 401) {
				notifications.show({
					title: "Error",
					message: "Please register and login to apply for this property.",
					color: "red",
				});
			} else if (error?.data) {
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
				console.log("nodata");
				notifications.show({
					title: "Error",
					message: "An unexpected error occurred. Please try again.",
					color: "red",
				});
			}
		}
	});

	return (
		<main className="main-container">
			<section style={{ margin: "1rem 0" }}>
				<div className="main-upper-section">
					<Button
						variant="outline"
						color="black"
						component="a"
						href="/listing"
						leftSection={
							<ThemeIcon variant="transparent">
								<img
									src="/images/back.svg"
									style={{ width: "90%" }}
									alt="back"
								/>
							</ThemeIcon>
						}
					>
						Go Back
					</Button>
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between",
						margin: "2rem 0 2.5rem 0",
					}}
				>
					<div style={{ width: "35%", height: "250" }}>
						<Carousel
							controlSize={30}
							loop
							withControls
							withIndicators={true}
							draggable
							styles={{
								control: {
									backgroundColor: "#fff",
								},
								indicator: {
									backgroundColor: "#33415c",
									border: "solid 1px lightgrey",
								},
							}}
						>
							{property?.images && property.images.length > 0 ? (
								property.images.map((image, index) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									<Carousel.Slide key={index + 1} h={250}>
										<Image
											src={image}
											alt={property.name || "Property image"}
											fit="cover"
											style={{
												width: "100%",
												height: "100%",
												borderRadius: "10px",
											}}
											fallbackSrc="/images/no-image.svg"
										/>
									</Carousel.Slide>
								))
							) : (
								<Carousel.Slide key="no-image" h={250}>
									<img
										src="/images/no-image.svg"
										alt="no-image"
										style={{
											width: "100%",
											height: "100%",
											borderRadius: "10px",
											border: "solid 1px lightgrey",
										}}
									/>
								</Carousel.Slide>
							)}
						</Carousel>
						<Spoiler
							maxHeight={100}
							showLabel="Show more"
							hideLabel="Hide"
							mt="1rem"
						>
							<Title order={3} size="h2">
								About Property
							</Title>
							<p>{property?.description}</p>
						</Spoiler>
					</div>
					<div style={{ width: "35%" }}>
						<Title order={2} size="h1">
							{property?.name}
						</Title>

						<p className="heading-info">{` ${property?.address}`}</p>
						{property?.type === "Unit Rental" ? (
							<>
								<Title order={3} size="h2">
									RM{property?.price}
								</Title>
								<Text mb="0.5rem">Deposit: RM{property?.depositAmount}</Text>
							</>
						) : (
							<>
								<Title order={3} size="h2">
									RM{property?.rooms?.[selectedRoom]?.price || "N/A"}
								</Title>
								<Text mb="0.5rem">
									Deposit: RM
									{property?.rooms?.[selectedRoom]?.depositAmount || "N/A"}
								</Text>
							</>
						)}
						{property?.type === "Room Rental" && (
							<Spoiler
								maxHeight={100}
								showLabel="Show more"
								hideLabel="Hide"
								mt="0.75rem"
							>
								<Title order={3} size="h2" mt="1rem">
									About Room
								</Title>
								<p>
									{property?.rooms?.[selectedRoom]?.description ||
										"No description available"}
								</p>
							</Spoiler>
						)}
					</div>
					<form
						onSubmit={handleSubmit}
						style={{
							width: "20%",
							border: "solid 1px lightgrey",
							borderRadius: "10px ",
							height: "fit-content",
							display: "flex",
							flexDirection: "column",
							gap: "1rem",
							padding: "1rem",
							justifyContent: "center",
						}}
					>
						<Text
							style={{
								fontWeight: "500",
								padding: "0 0.5rem",
								border: "solid 1px lightgrey",
								borderRadius: "5px",
								width: "fit-content",
								alignSelf: "center",
							}}
						>
							{property?.type}
						</Text>
						<DatePickerInput
							label="Start Date"
							placeholder="Pick Start Date"
							minDate={new Date()}
							onChange={(value) => {
								setFormData({ ...formData, startDate: value });
							}}
							allowDeselect
						/>
						<Select
							name="lengthStay"
							data={[
								{ label: "3 Months", value: "3" },
								{ label: "4 Months", value: "4" },
								{ label: "6 Months", value: "6" },
								{ label: "8 Months", value: "8" },
								{ label: "12 Months", value: "12" },
							]}
							onChange={(value) =>
								setFormData({ ...formData, stayLength: value })
							}
							allowDeselect={false}
							defaultValue={"3"}
							label="Stay Length"
						/>
						{property?.type === "Room Rental" && (
							<Select
								data={property?.rooms
									.filter((room) => room.isOccupied === false)
									.map((room, index) => ({
										label: room.name,
										value: room._id,
										index,
									}))}
								allowDeselect={false}
								onChange={(value, option) => {
									const selectedIndex = property.rooms.findIndex(
										(room) => room._id === value,
									);
									setSelectedRoom(selectedIndex);
									setFormData((prev) => ({ ...prev, room: value }));
								}}
								defaultValue={
									property?.rooms.find((room) => !room.isOccupied)?._id
								}
								label="Rooms"
							/>
						)}
						<Button
							variant="er-blue"
							type="submit"
							loading={isLoading}
							disabled={
								formData.startDate === "" ||
								isStatusLoading ||
								isActiveLoading ||
								!property?.isAvailable
							}
						>
							{property?.isFullyOccupied ? "Fully Occupied" : "Apply"}
						</Button>
					</form>
				</div>
			</section>
		</main>
	);
};

export default ListingDetails;
