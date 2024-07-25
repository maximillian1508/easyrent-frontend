import { ScrollArea, Table } from "@mantine/core";
import React from "react";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import Contract from "./Contract";
import { useGetContractsQuery } from "./contractsApiSlice";

const ContractHistory = () => {
	useTitle("Contract History");
	const { userId } = useAuth();
	const {
		data: contracts,
		isLoading,
		isSuccess,
		isError,
		error,
	} = useGetContractsQuery("contractsList", {
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
		//ids is just an array of user ids
		const { ids, entities } = contracts;
		const filteredIds = ids.filter(
			(contractId) => entities[contractId].user._id === userId,
		);

		const tableContent =
			filteredIds?.length > 0 ? (
				filteredIds.map((contractId, index) => (
					<Contract
						key={contractId}
						contractId={contractId}
						rowNumber={index + 1}
					/>
				))
			) : (
				<tr>No contracts found.</tr>
			);

		content = (
			<div style={{ flex: "1", minHeight: "0" }}>
				<ScrollArea h="100%">
					<Table highlightOnHover>
						<Table.Thead>
							<Table.Tr>
								<Table.Th>#</Table.Th>
								<Table.Th>Property Name</Table.Th>
								<Table.Th>Start Date</Table.Th>
								<Table.Th>End Date</Table.Th>
								<Table.Th>Rent Amount</Table.Th>
								<Table.Th>Deposit Amount</Table.Th>
								<Table.Th>Status</Table.Th>
								<Table.Th>Contract File</Table.Th>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>{tableContent}</Table.Tbody>
					</Table>
				</ScrollArea>
			</div>
		);
	}

	return (
		<main className="full-height-container">
			<section className="bordered-container">
				<div className="main-upper-section">
					<div>
						<h1>Contracts</h1>
					</div>
				</div>
				{content}
			</section>
		</main>
	);
};

export default ContractHistory;
