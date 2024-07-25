import { ActionIcon, Table } from "@mantine/core";
import React, { memo } from "react";
import useAuth from "../../hooks/useAuth";
import { useGetContractsQuery } from "./contractsApiSlice";

const Contract = ({ contractId, rowNumber }) => {
	const { userType } = useAuth();
	const { contract } = useGetContractsQuery("contractsList", {
		selectFromResult: ({ data }) => ({
			contract: data?.entities[contractId],
		}),
	});

	if (contract) {
		console.log(contract);
		return (
			<>
				<Table.Tr>
					<Table.Td>{rowNumber}</Table.Td>
					<Table.Td>
						{contract.property.name}{" "}
						{contract.roomName ? `(${contract.roomName})` : ""}
					</Table.Td>
					{userType === "admin" && (
						<>
							<Table.Td>
								{contract.user.firstname} {contract.user.lastname}
							</Table.Td>
							<Table.Td>{contract.user.email}</Table.Td>
						</>
					)}
					<Table.Td>
						{new Intl.DateTimeFormat("en-GB", {
							year: "numeric",
							month: "short",
							day: "numeric",
						}).format(new Date(contract.startDate))}
					</Table.Td>
					<Table.Td>
						{new Intl.DateTimeFormat("en-GB", {
							year: "numeric",
							month: "short",
							day: "numeric",
						}).format(new Date(contract.endDate))}
					</Table.Td>
					<Table.Td>{contract.rentAmount || contract.roomPrice}</Table.Td>
					<Table.Td>
						{contract.depositAmount || contract.roomDepositAmount}
					</Table.Td>
					<Table.Td>{contract.isActive ? "active" : "inactive"}</Table.Td>
					<Table.Td>
						<ActionIcon
							variant="light"
							color="gray"
							component="a"
							href={`${contract.contractFile}`}
							target="_blank"
						>
							<img
								src="/images/contract.svg"
								alt="edit"
								style={{ width: "70%" }}
							/>
						</ActionIcon>
					</Table.Td>
				</Table.Tr>
			</>
		);
	} else {
		return null;
	}
};

const memoizedContract = memo(Contract, (prevProps, nextProps) => {
	return (
		prevProps.contractId === nextProps.contractId &&
		prevProps.rowNumber === nextProps.rowNumber
	);
});

export default memoizedContract;
