import { Container, Grid, Image, Stack, Text, Title } from "@mantine/core";
import React from "react";
import { HashLink } from "react-router-hash-link";
import "./Footer.css";

function Footer() {
	return (
		<footer>
			<Container fluid mx="xl" py="xl">
				<Grid gutter="xl" grow>
					<Grid.Col span={{ base: 12, sm: 5 }}>
						<Container w="70%" mx={0} px={0} mb="1rem">
							<Image
								src="/images/er-horizontal-white.svg"
								w={150}
								alt="Easyrent"
								fit="contain"
								mb="1rem"
							/>
							<Text styles={{ textAlign: "justify" }}>
								EasyRent is an online platform that simplifies the house rental
								process. Unlock your dream home with EasyRent.
							</Text>
						</Container>
					</Grid.Col>
					<Grid.Col span={{ base: 6, sm: 2 }}>
						<Title order={2} mb="0.5rem">
							Product
						</Title>
						<Stack gap="xs">
							<nav>
								<ul>
									<li>
										<HashLink to="/listing#">Listing</HashLink>
									</li>
									<li>
										<HashLink to="/#featured" smooth>
											Featured
										</HashLink>
									</li>
									<li>
										<HashLink to="/faq#">FAQ</HashLink>
									</li>
									<li>
										<HashLink to="/faq#how-it-works" smooth>
											How it works
										</HashLink>
									</li>
								</ul>
							</nav>
						</Stack>
					</Grid.Col>
					<Grid.Col span={{ base: 6, sm: 2 }}>
						<Title order={2} mb="0.5rem">
							Company
						</Title>
						<Stack gap="xs">
							<nav>
								<ul>
									<li>
										<HashLink to="/about-us#">About us</HashLink>
									</li>
									<li>
										<HashLink to="/about-us#contact" smooth>
											Contact
										</HashLink>
									</li>
									<li>
										<a
											href="https://mail.google.com/mail/?view=cm&to=easyrent.corporate@gmail.com&su=CorporateSupport&body=Hello,%20I%20need%20support%20from%20EasyRent%20team."
											target="_blank"
											rel="noreferrer"
										>
											Support
										</a>
									</li>
								</ul>
							</nav>
						</Stack>
					</Grid.Col>
					<Grid.Col span={{ base: 6, sm: 2 }}>
						<Title order={2} mb="0.5rem">
							Socials
						</Title>
						<Stack gap="xs">
							<nav>
								<ul>
									<li>
										<a
											href="https://www.instagram.com/maxi.984"
											target="_blank"
											rel="noreferrer"
										>
											Instagram
										</a>
									</li>
									<li>
										<a
											href="https://www.facebook.com/"
											target="_blank"
											rel="noreferrer"
										>
											Facebook
										</a>
									</li>
									<li>
										<a
											href="https://www.linkedin.com/in/maximillianleonard1508/"
											target="_blank"
											rel="noreferrer"
										>
											LinkedIn
										</a>
									</li>
									<li>
										<a
											href="https://www.x.com/"
											target="_blank"
											rel="noreferrer"
										>
											X (Twitter)
										</a>
									</li>
									<li>
										<a
											href="https://www.tiktok.com/"
											target="_blank"
											rel="noreferrer"
										>
											Tiktok
										</a>
									</li>
								</ul>
							</nav>
						</Stack>
					</Grid.Col>
				</Grid>
				<Text mt="1rem">© 2023 EasyRent. All rights reserved.</Text>
			</Container>
		</footer>
	);
}

export default Footer;
