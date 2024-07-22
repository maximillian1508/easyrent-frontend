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
import { useGetPropertiesQuery } from "./propertiesApiSlice";

const Listing = ({ propertyId }) => {
	const { property } = useGetPropertiesQuery("propertiesList", {
		selectFromResult: ({ data }) => ({
			property: data?.entities[propertyId],
		}),
	});
	if (property) {
		return (
			<Grid.Col key={propertyId} span={{ base: 12, xs: 6, sm: 4 }}>
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
							fallbackSrc="/images/no-image.svg"
							fit="contain"
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
						mb="0"
						styles={{ root: { gap: "0" } }}
					>
						<Text fw={500} style={{ width: "70%", textWrap: "wrap" }}>
							{property.name}
						</Text>
						<Text fw={600}>
							RM
							{property.type === "Unit Rental"
								? property.price
								: property.priceRange}
						</Text>
					</Group>

					<Text
						size="sm"
						c="dimmed"
						style={{ width: "70%", textWrap: "wrap", marginBottom: "2rem" }}
						lineClamp={2}
					>
						{property.address}
					</Text>

					<Button
						variant="er-blue"
						radius="md"
						component="a"
						href={`/listing/${propertyId}`}
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

const memoizedProperty = memo(Listing, (prevProps, nextProps) => {
	return prevProps.propertyId === nextProps.propertyId;
});

export default memoizedProperty;
