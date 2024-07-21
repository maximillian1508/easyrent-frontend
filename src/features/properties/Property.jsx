import {
	Button,
	Card,
	Grid,
	Group,
	Image,
	Text,
	ThemeIcon,
} from "@mantine/core";
import React, { memo } from "react";
import { useGetPropertiesQuery } from "./propertiesApiSlice";

const Property = ({ propertyId }) => {
	const { property } = useGetPropertiesQuery("propertiesList", {
		selectFromResult: ({ data }) => ({
			property: data?.entities[propertyId],
		}),
	});
	if (property) {
		console.log(property);
		return (
			<Grid.Col key={propertyId} span={{ base: 12, xs: 6, sm: 3 }}>
				<Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
					<Card.Section style={{ borderBottom: "solid 1px lightgrey" }}>
						<Image
							src={property.images[0]}
							height={160}
							alt={property.name}
							fit="contain"
							fallbackSrc="./images/no-image.svg"
						/>
					</Card.Section>

					<Group
						justify="space-between"
						mt="md"
						mb="xs"
						styles={{ root: { gap: "0" } }}
						align="end"
					>
						<Text fw={500} style={{ width: "70%", textWrap: "wrap" }}>
							{property.type}
						</Text>
						<ThemeIcon
							color={property.isFull ? "red" : "green"}
							styles={{ root: { width: "fit-content" } }}
						>
							{property.isFull ? "Full" : "Available"}
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
						{property.name}, {property.address}
					</Text>

					<Button
						variant="er-blue"
						radius="md"
						component="a"
						href="/listing"
						style={{ width: "fit-content", margin: "auto auto 0 auto" }}
					>
						View Details
					</Button>
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
