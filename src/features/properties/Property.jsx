import {
	Button,
	Card,
	Grid,
	Group,
	Image,
	Indicator,
	Text,
	ThemeIcon,
} from "@mantine/core";
import React, { memo } from "react";
import { useGetApplicationsQuery } from "../applications/applicationsApiSlice";
import { useGetPropertiesQuery } from "./propertiesApiSlice";

const Property = ({ propertyId }) => {
	const { property } = useGetPropertiesQuery("propertiesList", {
		selectFromResult: ({ data }) => ({
			property: data?.entities[propertyId],
		}),
	});

	const { data: applications } = useGetApplicationsQuery();

	const pendingApplicationCount =
		applications?.ids.filter(
			(id) =>
				applications.entities[id].property?._id === propertyId &&
				applications.entities[id].status === "Waiting for Response",
		).length || 0;

	if (property) {
		return (
			<Grid.Col key={propertyId} span={{ base: 12, xs: 6, sm: 3 }}>
				<Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
					<Card.Section
						style={{
							borderBottom: "solid 1px lightgrey",
							position: "relative",
							marginBottom: "0.5rem",
						}}
					>
						<Image
							src={property.images[0]}
							height={160}
							alt={property.name}
							fit="contain"
							fallbackSrc="./images/no-image.svg"
						/>
						<Text
							style={{
								position: "absolute",
								bottom: "0",
								right: "50%",
								transform: "translate(50%, 50%)",
								backgroundColor: "#fff",
								borderRadius: "5px",
								border: "solid 1px lightgrey",
								fontWeight: "500",
								padding: "0 0.5rem",
							}}
						>
							{property.type}
						</Text>
					</Card.Section>

					<Group
						justify="space-between"
						mt="md"
						mb="xs"
						styles={{ root: { gap: "0" } }}
						align="end"
					>
						<Text
							fw={500}
							style={{ width: "70%", textWrap: "wrap" }}
							lineClamp={1}
						>
							{property.name}
						</Text>
						<ThemeIcon
							color={property.isFullyOccupied ? "red" : "green"}
							styles={{ root: { width: "fit-content" } }}
						>
							{property.isFullyOccupied ? "Full" : "Available"}
						</ThemeIcon>
					</Group>

					<Text
						size="sm"
						c="dimmed"
						lineClamp={3}
						style={{
							width: "80%",
							textWrap: "wrap",
							marginBottom: "2rem",
						}}
					>
						{property.address}
					</Text>

					<Indicator
						label={pendingApplicationCount}
						size={30}
						radius="xl"
						color="red"
						disabled={pendingApplicationCount === 0}
						position="top-end"
						styles={{
							root: { margin: "auto auto 0 auto" },
							indicator: { fontSize: "1.1rem", fontWeight: "500" },
						}}
						withBorder
					>
						<Button
							variant="er-blue"
							radius="md"
							component="a"
							href={`/manage-properties/details/${propertyId}`}
							style={{ width: "fit-content" }}
						>
							View Details
						</Button>
					</Indicator>
				</Card>
			</Grid.Col>
		);
	} else {
		return null;
	}
};

const memoizedProperty = memo(Property, (prevProps, nextProps) => {
	return prevProps.propertyId === nextProps.propertyId;
});

export default memoizedProperty;
