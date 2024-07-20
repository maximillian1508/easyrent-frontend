import { Carousel } from "@mantine/carousel";
import {
	Autocomplete,
	Button,
	Card,
	Group,
	Image,
	Select,
	Text,
	Title,
} from "@mantine/core";
import React from "react";
import "./Home.css";
import useTitle from "../../hooks/useTitle";

const FeaturedSection = () => {
	const featuredListing = [
		{
			propertyName: "Parkhill Residence",
			image: "",
			rentalType: "Room",
			price: "200",
			roomAmount: "2",
			address: "Bukit Jalil",
		},
		{
			propertyName: "Parkhill Residence",
			image: "",
			rentalType: "Room",
			price: "200",
			roomAmount: "2",
			address: "Bukit Jalil",
		},
		{
			propertyName: "Parkhill Residence",
			image: "",
			rentalType: "Room",
			price: "200",
			roomAmount: "2",
			address: "Bukit Jalil",
		},
		{
			propertyName: "Parkhill Residence",
			image: "",
			rentalType: "Room",
			price: "200",
			roomAmount: "2",
			address: "Bukit Jalil",
		},
		{
			propertyName: "Parkhill Residence",
			image: "",
			rentalType: "Room",
			price: "200",
			roomAmount: "2",
			address: "Bukit Jalil",
		},
		{
			propertyName: "Parkhill Residence",
			image: "",
			rentalType: "Room",
			price: "200",
			roomAmount: "2",
			address: "Bukit Jalil",
		},
		{
			propertyName: "Parkhill Residence",
			image: "",
			rentalType: "Room",
			price: "200",
			roomAmount: "2",
			address: "Bukit Jalil",
		},
		{
			propertyName: "Parkhill Residence",
			image: "",
			rentalType: "Room",
			price: "200",
			roomAmount: "2",
			address: "Bukit Jalil",
		},
	];

	return (
		<>
			<Title order={2} size="h1">
				Featured Listings
			</Title>
			<p className="heading-info">Explore Our Featured Rentals</p>
			<Carousel
				slideSize={{ base: "80%", sm: "33.33333%" }}
				slideGap={"md"}
				align="center"
				slidesToScroll={{ base: "1", sm: "3" }}
				controlSize={50}
				loop
				withControls
				draggable
				styles={{
					root: { width: "100%" },
					control: {
						backgroundColor: "#fff",
					},
				}}
			>
				{featuredListing.map((item) => (
					<Carousel.Slide key={item.propertyName}>
						<Card shadow="sm" padding="lg" radius="md" withBorder>
							<Card.Section style={{ borderBottom: "solid 1px lightgrey" }}>
								<Image src={item.image} height={160} alt={item.propertyName} />
							</Card.Section>

							<Group
								justify="space-between"
								mt="md"
								mb="0"
								styles={{ root: { gap: "0" } }}
							>
								<Text fw={500} style={{ width: "70%", textWrap: "wrap" }}>
									{item.rentalType} Rental - {item.roomAmount} Bedroom(s)
								</Text>
								<Text fw={600}>RM{item.price}</Text>
							</Group>

							<Text
								size="sm"
								c="dimmed"
								style={{ width: "70%", textWrap: "wrap", marginBottom: "1rem" }}
							>
								{item.propertyName}, {item.address}
							</Text>

							<Button
								variant="er-blue"
								radius="md"
								component="a"
								href="/listing"
								style={{ width: "fit-content", margin: "1rem auto 0 auto" }}
							>
								View Details
							</Button>
						</Card>
					</Carousel.Slide>
				))}
			</Carousel>
			<Button
				component="a"
				href="/listing"
				variant="er-blue"
				mt="lg"
				size="md"
				radius="xl"
			>
				See More Listings
			</Button>
		</>
	);
};

const Home = () => {
	useTitle("Home");

	const location = ["Parkhill", "Kuala Lumpur", "Melaka", "Kuala Terengganu"];

	return (
		<main>
			<section
				className="home-top-sect"
				style={{ backgroundImage: "url(/images/home-bg2.jpg)" }}
			>
				<h1 className="home-title">A More Convenient Home Rental With Us</h1>
				<div className="home-search">
					<div
						style={{ display: "flex", flexDirection: "column", width: "80%" }}
					>
						<Select
							placeholder="Search a location"
							data={location}
							comboboxProps={{ offset: 0 }}
							searchable
							scrollable="true"
							maxDropdownHeight={200}
							styles={{ section: { display: "none" } }}
						/>
						<div
							style={{
								display: "flex",
								flexDirection: "row",
								gap: "1rem",
								marginTop: "0.5rem",
								justifyContent: "center",
							}}
						>
							<Select
								label="Rental Type"
								data={[
									{ group: "Room Rent", items: ["Room"] },
									{
										group: "Unit Rent",
										items: [
											"1+ bedrooms",
											"2+ bedrooms",
											"3+ bedrooms",
											"4+ bedrooms",
											"5+ bedrooms",
										],
									},
								]}
								placeholder="Choose Type"
								comboboxProps={{ withinPortal: false, offset: 0 }}
								maxDropdownHeight={150}
								style={{ width: "50%" }}
								clearable="true"
							/>

							<Autocomplete
								label="Min Price"
								placeholder="Enter Min Price"
								data={["No min", "500", "1000", "1500"]}
								comboboxProps={{ withinPortal: false, offset: 0 }}
							/>
							<Autocomplete
								label="Max Price"
								placeholder="Enter Max Price"
								data={["React", "Angular", "Vue", "Svelte"]}
								comboboxProps={{ withinPortal: false, offset: 0 }}
								clearable="true"
							/>
						</div>
					</div>
					<Button
						variant="er-blue"
						component="a"
						href="/listing"
						styles={{
							label: { overflow: "visible" },
						}}
					>
						Search
					</Button>
				</div>
			</section>

			<section className="home-sect" id="featured">
				<FeaturedSection />
			</section>

			<section className="home-sect" id="services">
				<Title order={2} size="h1">
					Our Services
				</Title>
				<Group align="center" justify="space-between" mb="xl">
					<p className="service-title-info">
						Our Premier Services for Your House Rental Needs
					</p>
					<p className="service-title-explanation">
						Experience hassle-free renting with peace of mind. Our platform
						ensures your comfort from start to finish, providing a smooth
						journey to your ideal home.
					</p>
				</Group>
				<Group grow gap="md" mb="lg" w="100%" justify="center">
					<div className="service-card">
						<div className="service-icon">
							<img src="./images/house-white.svg" alt="house" />
						</div>
						<Title order={3} size="h2">
							Maintained House
						</Title>
						<p>
							We partner with responsible landlords who prioritize property
							upkeep, guaranteeing you&apos;ll move into a clean and comfortable
							home.
						</p>
					</div>
					<div className="service-card">
						<div className="service-icon">
							<img src="./images/apply-white.svg" alt="application" />
						</div>
						<Title order={3} size="h2">
							Seamless Application
						</Title>
						<p>
							Streamlined process that allows you to complete your rental
							application quickly and effortlessly, saving time and reducing
							stress.
						</p>
					</div>
					<div className="service-card">
						<div className="service-icon">
							<img src="./images/secure.svg" alt="payment" />
						</div>
						<Title order={3} size="h2">
							Secure Payments
						</Title>
						<p>
							Our trusted and encrypted payment gateways protect your financial
							information, ensuring transactions are safe and confidential.
						</p>
					</div>
				</Group>
			</section>
		</main>
	);
};

export default Home;
