import { Carousel } from "@mantine/carousel";
import {
	Button,
	Image,
	ScrollArea,
	Select,
	Spoiler,
	Table,
	Text,
	ThemeIcon,
	Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useTitle from "../../hooks/useTitle";
import { useGetPropertiesQuery } from "./propertiesApiSlice";

const ListingDetails = () => {
	useTitle("Property Details");

	const { propertyId } = useParams();
	const { property } = useGetPropertiesQuery("propertiesList", {
		selectFromResult: ({ data }) => ({
			property: data?.entities[propertyId],
		}),
	});
	const [selectedRoom, setSelectedRoom] = useState(0);
	const navigate = useNavigate();

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
					<div style={{ width: "35%", height: "250", display: "flex" }}>
						<Carousel
							controlSize={30}
							loop
							withControls
							withIndicators={true}
							draggable
							styles={{
								root: {
									flex: "1",
								},
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
									RM{property?.rooms[selectedRoom].price}
								</Title>
								<Text mb="0.5rem">
									Deposit: RM{property?.rooms[selectedRoom].depositAmount}
								</Text>
							</>
						)}
						<Spoiler maxHeight={130} showLabel="Show more" hideLabel="Hide">
							<p>Property Desc: {property?.description}</p>
						</Spoiler>
						{property?.type === "Room Rental" && (
							<Spoiler maxHeight={130} showLabel="Show more" hideLabel="Hide">
								<p>
									Room Desc: {property?.rooms[selectedRoom].description || "-"}
								</p>
							</Spoiler>
						)}
					</div>
					<div
						style={{
							width: "20%",
							border: "solid 1px lightgrey",
							borderRadius: "10px ",
							height: "35vh",
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
						{property?.type === "Room Rental" && (
							<Select
								data={property?.rooms.map((room, index) => {
									return { label: room.name, value: room._id, index };
								})}
								allowDeselect={false}
								onChange={(_value, option) => setSelectedRoom(option?.index)}
								defaultValue={property?.rooms[0]._id}
								label="Rooms"
							/>
						)}
						<Button variant="er-blue">Apply</Button>
					</div>
				</div>
			</section>
		</main>
	);
};

export default ListingDetails;
