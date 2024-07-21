import { Button, Grid } from "@mantine/core";
import React, { useEffect, useState } from "react";
import useTitle from "../../hooks/useTitle";
import Property from "./Property";
import { useGetPropertiesQuery } from "./propertiesApiSlice";

const PropertyListing = () => {
	useTitle("Property Listing");

	const {
		data: properties,
		isLoading,
		isSuccess,
		isError,
		error,
	} = useGetPropertiesQuery("propertiesList", {
		pollingInterval: 60000,
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true,
	});

	let content;

	if (isLoading) {
		content = <p>Loading...</p>;
	}

	if (isError) {
		content = <p>Error: {error?.data?.message}</p>;
	}

	if (isSuccess) {
		const { ids, entities } = properties;

		const gridContent =
			ids?.length &&
			ids.map((propertyId, index) => (
				<Property key={propertyId} propertyId={propertyId} />
			));

		content = (
			<>
				<section>
					<div className="main-upper-section">
						<div>
							<h1>Property Listings</h1>
							<p>Discover your dream properties here.</p>
						</div>
					</div>
					<Grid>{gridContent}</Grid>
				</section>
			</>
		);
	}

	return <main className="main-container">{content}</main>;
};

export default PropertyListing;
