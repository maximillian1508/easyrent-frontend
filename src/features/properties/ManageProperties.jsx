import { Button, Grid } from "@mantine/core";
import React from "react";
import useTitle from "../../hooks/useTitle";
import "./ManageProperties.css";
import Property from "./Property";
import { useGetPropertiesQuery } from "./propertiesApiSlice";

const ManageProperties = () => {
	useTitle("Manage Properties");

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
							<h1>Properties</h1>
							<p>Manage your properties here.</p>
						</div>
						<Button
							variant="er-blue"
							component="a"
							href="/manage-properties/add"
						>
							Add New Property
						</Button>
					</div>
					<Grid>{gridContent}</Grid>
				</section>
			</>
		);
	}

	return <main className="main-container">{content}</main>;
};

export default ManageProperties;
