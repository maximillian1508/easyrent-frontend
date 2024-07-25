import { Button, ScrollArea, Select, Table, ThemeIcon } from "@mantine/core";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useTitle from "../../hooks/useTitle";
import { useGetPropertiesQuery } from "../properties/propertiesApiSlice";
import AdminApplication from "./AdminApplication";
import { useGetApplicationsQuery } from "./applicationsApiSlice";

const ManageApplications = () => {
	useTitle("Manage Applications");
	const navigate = useNavigate();
	const { propertyId } = useParams();
	const [selectedRoomId, setSelectedRoomId] = useState(null);
	const [propertyType, setPropertyType] = useState("Unit Rental"); // Default to 'Unit Rental'

	const {
		data: applications,
		isLoading,
		isSuccess,
		isError,
		error,
	} = useGetApplicationsQuery("applicationsList", {
		pollingInterval: 60000,
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true,
	});

	const {
		data: properties,
		isLoading: isLoadingProperties,
		isSuccess: isSuccessProperties,
	} = useGetPropertiesQuery();

	useEffect(() => {
		if (isSuccessProperties && properties.entities[propertyId]) {
			const property = properties.entities[propertyId];
			setPropertyType(property.type);
			if (property.type === "Room Rental" && property.rooms.length > 0) {
				setSelectedRoomId(property.rooms[0]._id);
			}
		}
	}, [isSuccessProperties, properties, propertyId]);

	let content;
	if (isLoading || isLoadingProperties) {
		content = <p>Loading...</p>;
	}
	if (isError) {
		content = <p>Error: {error?.data?.message}</p>;
	}
	if (isSuccess && isSuccessProperties) {
		const { ids, entities } = applications;
		const property = properties.entities[propertyId];

		const filteredIds = ids.filter((applicationId) => {
			const entity = entities[applicationId];
			if (propertyType === "Unit Rental") {
				return entity.property._id === propertyId;
			} else {
				return (
					entity.property._id === propertyId && entity.roomId === selectedRoomId
				);
			}
		});

		let tableContent;
		if (filteredIds?.length) {
			tableContent = filteredIds.map((applicationId, index) => (
				<AdminApplication
					key={applicationId}
					applicationId={applicationId}
					rowNumber={index + 1}
				/>
			));
		} else {
			tableContent = (
				<tr>
					<td colSpan="8">No applications found</td>
				</tr>
			);
		}

		content = (
			<div style={{ flex: "1", minHeight: "0" }}>
				<ScrollArea h="100%">
					<Table highlightOnHover>
						<Table.Thead>
							<Table.Tr>
								<Table.Th>#</Table.Th>
								<Table.Th>Cust. Name</Table.Th>
								<Table.Th>Cust. Email</Table.Th>
								<Table.Th>Start Date</Table.Th>
								<Table.Th>Stay Length</Table.Th>
								<Table.Th>End Date</Table.Th>
								<Table.Th>Status</Table.Th>
								<Table.Th />
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>{tableContent}</Table.Tbody>
					</Table>
				</ScrollArea>
			</div>
		);
	}

	return (
		<main className="main-container">
			<section>
				<div className="main-upper-section">
					<Button
						variant="outline"
						color="black"
						onClick={() => {
							navigate(-1);
						}}
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
					{propertyType === "Room Rental" && isSuccessProperties && (
						<Select
							label="Select Room"
							placeholder="Choose a room"
							data={properties.entities[propertyId].rooms.map((room) => ({
								value: room._id,
								label: room.name,
							}))}
							value={selectedRoomId}
							onChange={setSelectedRoomId}
							style={{ width: "200px" }}
						/>
					)}
				</div>
				{content}
			</section>
		</main>
	);
};

export default ManageApplications;
