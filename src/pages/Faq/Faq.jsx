import { Accordion, Text, Timeline, Title } from "@mantine/core";
import "./Faq.css";
import React from "react";
import useTitle from "../../hooks/useTitle";

const Faq = () => {
	useTitle("FAQ");
	return (
		<main
			style={{
				width: "90%",
				display: "flex",
				flexDirection: "column",
				margin: "2rem auto",
				textAlign: "center",
			}}
		>
			<Title order={1}>Frequently Asked Questions</Title>
			<p className="heading-info">
				Get answers to your questions about our house rental service.
			</p>
			<section id="how-it-works">
				<Title order={2}>How It Works</Title>
				<p className="heading-info" style={{ marginTop: "0" }}>
					Few steps to rent your perfect home with us
				</p>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						width: "100%",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<Timeline
						active={4}
						bulletSize={24}
						lineWidth={2}
					>
						<Timeline.Item title="Discover and choose a property">
							<Text c="dimmed" size={{ base: "md", sm: "sm" }}>
								Explore our extensive catalog of available properties, utilizing
								our advanced search filters to narrow down options based on your
								preferences. After careful consideration, select the perfect
								property that aligns with you.
							</Text>
						</Timeline.Item>

						<Timeline.Item title="Apply for the rental">
							<Text c="dimmed" size={{ base: "md", sm: "sm" }}>
								Complete and submit our online application. Provide necessary
								personal information and employment details. Upload required
								documents such as identification and references.
							</Text>
						</Timeline.Item>

						<Timeline.Item title="Submit the contract & deposit payment">
							<Text c="dimmed" size={{ base: "md", sm: "sm" }}>
								If your application is approved, sign the digital contract using
								the secure e-signature system. Then, transfer the deposit and
								first month&apos;s rent through the integrated payment platform.
							</Text>
						</Timeline.Item>

						<Timeline.Item title="Rental process completed!">
							<Text c="dimmed" size={{ base: "md", sm: "sm" }}>
								Your rental process has been completed. The landlord will
								provide you with a detailed move-in package, including key, and
								a comprehensive welcome guide
							</Text>
						</Timeline.Item>

						<Timeline.Item title="Manage your rental necessities with our services">
							<Text c="dimmed" size={{ base: "md", sm: "sm" }}>
								Now that you&apos;re settled in, take advantage of our
								user-friendly tenant portal. Here, you can easily pay rent
								online, submit maintenance requests 24/7, and access
								informations related to your tenancy.
							</Text>
						</Timeline.Item>
					</Timeline>
					<div style={{ width: "45%" }} className="faq-image">
						<img
							src="./images/rent-illustration.svg"
							alt="rent-illustration"
							style={{ width: "100%", height: "100%", objectFit: "contain" }}
						/>
					</div>
				</div>
			</section>
			<section id="common-queries">
				<Title order={2}>Common Queries</Title>
				<p className="heading-info" style={{ marginTop: "0" }}>
					Frequently asked questions about our house rental service
				</p>
				<Accordion
					variant="filled"
					defaultValue="Apples"
					styles={{
						label: { fontSize: "1.25rem", fontWeight: "500" },
						panel: { fontSize: "1.15rem" },
					}}
				>
					<Accordion.Item key="q1" value="q1">
						<Accordion.Control>
							Can I check the status of my rental application?
						</Accordion.Control>
						<Accordion.Panel>
							Yes, you can view the status of your current and past applications
							in the &quot;My Applications&quot; section of your account
							dashboard. Statuses include &quot;Submitted&quot;,
							&quot;Approved&quot;, and &quot;Declined&quot;.
						</Accordion.Panel>
					</Accordion.Item>
					<Accordion.Item key="q2" value="q2">
						<Accordion.Control>
							How do I pay my rent through the website?
						</Accordion.Control>
						<Accordion.Panel>
							Once your application is approved and you&apos;re a tenant, you
							can pay rent through the &quot;Payments&quot; section of your
							account. We accept various payment methods including credit/debit
							cards and bank transfers. You can also set up automatic monthly
							payments for convenience.
						</Accordion.Panel>
					</Accordion.Item>
					<Accordion.Item key="q3" value="q3">
						<Accordion.Control>
							What should I do if I have a complaint about my rental?
						</Accordion.Control>
						<Accordion.Panel>
							To submit a complaint, go to the &quot;Support&quot; section of
							your account and select &quot;Submit a Complaint.&quot; Provide
							details about the issue, and you can even upload photos if
							necessary. You can track the status of your complaint in the same
							section.
						</Accordion.Panel>
					</Accordion.Item>
					<Accordion.Item key="q4" value="q4">
						<Accordion.Control>
							Is my personal and payment information secure?
						</Accordion.Control>
						<Accordion.Panel>
							We take security very seriously. All personal and payment
							information is encrypted and stored securely. We use
							industry-standard security protocols and regularly update our
							systems to ensure your data is protected.
						</Accordion.Panel>
					</Accordion.Item>
					<Accordion.Item key="q5" value="q5">
						<Accordion.Control>
							How do I contact property owners or managers?
						</Accordion.Control>
						<Accordion.Panel>
							Once you&apos;re logged in, you can view the contact information
							for property owners on their listing pages. For properties
							you&apos;ve applied to or are renting, you can communicate
							directly with the owner or manager through our messaging system in
							the &quot;Communications&quot; section of your account.
						</Accordion.Panel>
					</Accordion.Item>
				</Accordion>
			</section>
		</main>
	);
};

export default Faq;
