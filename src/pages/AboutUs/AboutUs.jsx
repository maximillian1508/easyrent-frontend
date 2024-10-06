import React from "react";
import "./AboutUs.css";
import { Avatar, Grid, ThemeIcon, Title } from "@mantine/core";
import useTitle from "../../hooks/useTitle";

const AboutUs = () => {
	useTitle("About Us");
	return (
		<main>
			<section className="about-welcome">
				<div>
					<Title order={1}>Welcome to Easyrent</Title>
					<p>
						We are a team dedicated to providing exceptional house rental
						experiences. Discover your dream rental home with our curated
						selection of cozy, high-quality properties.
					</p>
				</div>
			</section>
			<section className="about-company">
				<div>
					<Title order={2} size="h1">
						About Our Company
					</Title>
					<p>
						At Easyrent, we are passionate about providing exceptional house
						rental experiences. Our mission is to connect potential tenants with
						beautifully curated homes that offer comfort, style, and a touch of
						luxury.
					</p>
					<p>
						We believe that a great life starts with a great place to stay.
						That&apos;s why we carefully select and maintain our properties,
						ensuring they meet the highest standards of cleanliness, amenities,
						and hospitality.
					</p>
				</div>
				<div>
					<Title order={2} size="h1">
						Our Core Values
					</Title>
					<div className="value-container">
						<div className="value-title">
							<ThemeIcon radius="lg" variant="white">
								<img
									src="./images/heart-dark-grey.svg"
									alt="heart"
									style={{ width: "70%", height: "70%" }}
								/>
							</ThemeIcon>
							<p style={{ marginTop: "0" }}>Exceptional Service</p>
						</div>

						<p style={{ width: "94%", marginLeft: "auto", marginTop: "0" }}>
							We are dedicated to providing our guests with personalized
							attention and going above and beyond to ensure their satisfaction.{" "}
						</p>
					</div>
					<div className="value-container">
						<div className="value-title">
							<ThemeIcon radius="lg" variant="white">
								<img
									src="./images/house-dark-grey.svg"
									alt="house"
									style={{ width: "70%", height: "70%" }}
								/>
							</ThemeIcon>
							<p style={{ marginTop: "0" }}>Comfort and Luxury</p>
						</div>

						<p style={{ width: "94%", marginLeft: "auto", marginTop: "0" }}>
							Our home listings are designed to offer the perfect balance of
							comfort and style, creating a truly relaxing and indulgent
							experience.
						</p>
					</div>
					<div className="value-container">
						<div className="value-title">
							<ThemeIcon radius="lg" variant="white">
								<img
									src="./images/smiley-dark-grey.svg"
									alt="heart"
									style={{ width: "70%", height: "70%" }}
								/>
							</ThemeIcon>
							<p style={{ marginTop: "0" }}>Memorable Experiences</p>
						</div>

						<p style={{ width: "94%", marginLeft: "auto", marginTop: "0" }}>
							We aim to create unforgettable memories for our tenants, whether
							it&apos;s through unique experiences or thoughtful touches in our
							homes.
						</p>
					</div>
				</div>
			</section>

			<section className="about-team">
				<Title order={2} size="h1">
					Meet the Team
				</Title>
				<p
					className="heading-info"
					style={{
						textWrap: "wrap",
						margin: "0.5rem auto 1.5rem auto",
					}}
				>
					Our team is made up of talented individuals who are passionate about
					providing exceptional experiences for our guests.
				</p>
				<div>
					<div>
						<Avatar
							alt="it's me"
							styles={{
								root: { height: "40%" },
								placeholder: {
									backgroundColor: "#fff",
								},
							}}
						>
							<img
								src="./images/user-hair.svg"
								alt="user"
								style={{ width: "100%", height: "100%" }}
							/>
						</Avatar>
						<Title order={4} size="h3" mt="sm">
							John Doe
						</Title>
						<p className="heading-info" style={{ marginTop: "0" }}>
							CFO
						</p>
					</div>
					<div>
						<Avatar
							src="./images/profile-picture.jpg"
							alt="it's me"
							styles={{
								root: { height: "40%" },
								image: { width: "100%", height: "100%", borderRadius: "50%" },
							}}
						/>
						<Title order={4} size="h3" mt="sm">
							Maximillian Leonard
						</Title>
						<p className="heading-info" style={{ marginTop: "0" }}>
							Co-Founder & CTO
						</p>
					</div>
					<div>
						<Avatar
							alt="it's me"
							styles={{
								root: { height: "40%" },
								placeholder: { backgroundColor: "#fff" },
							}}
						>
							<img
								src="./images/user-hair.svg"
								alt="user"
								style={{ width: "100%", height: "100%" }}
							/>
						</Avatar>
						<Title order={4} size="h3" mt="sm">
							Michael Kahn
						</Title>
						<p className="heading-info" style={{ marginTop: "0" }}>
							Operations Manager
						</p>
					</div>
				</div>
			</section>
			<section id="contact">
				<Title order={2} size="h1">
					Get in Touch
				</Title>
				<p className="heading-info" style={{
					textWrap: "wrap",
					textAlign: "center"
				}}>
					Have a question or a concern? Reach out to us and we&apos;ll be happy
					to assist you.
				</p>
				<Grid styles={{ root: { margin: "1rem auto", width: "85%" } }}>
					<Grid.Col span={{ base: "6", sm: "4" }}>
						<div className="contact-card">
							<div className="contact-icon">
								<img src="./images/email.svg" alt="email" />
							</div>
							<Title order={4} size="h3">
								Email
							</Title>
							<p
								className="heading-info"
								style={{ marginTop: "0", fontSize: "1rem" }}
							>
								easyrent.corp@gmail.com
							</p>
						</div>
					</Grid.Col>
					<Grid.Col span={{ base: "6", sm: "4" }}>
						<div className="contact-card">
							<div className="contact-icon">
								<img src="./images/phone.svg" alt="phone" />
							</div>
							<Title order={4} size="h3">
								Phone
							</Title>
							<p
								className="heading-info"
								style={{ marginTop: "0", fontSize: "1rem" }}
							>
								+60 888 888 888
							</p>
						</div>
					</Grid.Col>
					<Grid.Col span={{ base: "6", sm: "4" }}>
						<div className="contact-card">
							<div className="contact-icon">
								<img src="./images/instagram.svg" alt="instagram" />
							</div>
							<Title order={4} size="h3">
								Instagram
							</Title>
							<p
								className="heading-info"
								style={{ marginTop: "0", fontSize: "1rem" }}
							>
								@easyrent
							</p>
						</div>
					</Grid.Col>
					<Grid.Col span={{ base: "6", sm: "4" }}>
						<div className="contact-card">
							<div className="contact-icon">
								<img src="./images/linkedin.svg" alt="linkedin" />
							</div>
							<Title order={4} size="h3">
								LinkedIn
							</Title>
							<p
								className="heading-info"
								style={{ marginTop: "0", fontSize: "1rem" }}
							>
								@easyrent
							</p>
						</div>
					</Grid.Col>
					<Grid.Col span={{ base: "6", sm: "4" }}>
						<div className="contact-card">
							<div className="contact-icon">
								<img src="./images/facebook.svg" alt="facebook" />
							</div>
							<Title order={4} size="h3">
								Facebook
							</Title>
							<p
								className="heading-info"
								style={{ marginTop: "0", fontSize: "1rem" }}
							>
								Easyrent
							</p>
						</div>
					</Grid.Col>
					<Grid.Col span={{ base: "6", sm: "4" }}>
						<div className="contact-card">
							<div className="contact-icon">
								<img src="./images/pin-address.svg" alt="address" />
							</div>
							<Title order={4} size="h3">
								Address
							</Title>
							<p
								className="heading-info"
								style={{ marginTop: "0", fontSize: "1rem", textAlign: "center" }}
							>
								Parkhill Residence, Bukit Jalil
							</p>
						</div>
					</Grid.Col>
				</Grid>
			</section>
		</main>
	);
};

export default AboutUs;
