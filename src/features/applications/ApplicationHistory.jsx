import {
	Grid,
	LoadingOverlay,
	ScrollArea,
	Tabs,
	ThemeIcon,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import CustomerApplication from "./CustomerApplication";
import { useGetApplicationsQuery } from "./applicationsApiSlice";

const filterApplications = (applications, activeTab) => {
	if (activeTab === "all") return applications;
	return applications.filter((app) => app.status === activeTab);
};

const ApplicationHistory = () => {
	useTitle("Application History");
	const [activeTab, setActiveTab] = useState("all");

	let content;

	const { userId } = useAuth();
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

	if (isLoading) {
		return <LoadingOverlay visible={true} />;
	}

	if (isError) {
		content = <p>Error: {error?.data?.message}</p>;
	}

	if (isSuccess) {
		const { ids, entities } = applications;

		const filteredIds = ids.filter(
			(applicationId) => entities[applicationId].user._id === userId,
		);

		const filteredApplications = filterApplications(
			filteredIds.map((id) => entities[id]),
			activeTab,
		);

		const gridContent =
			filteredApplications.length > 0 ? (
				filteredApplications.map((application) => (
					<CustomerApplication
						key={application._id}
						applicationId={application._id}
					/>
				))
			) : (
				<p style={{ marginTop: "1rem" }}>
					No applications found for this status.
				</p>
			);

		content = (
			<>
				<section style={{ margin: "0" }}>
					<ScrollArea scrollbars="y" style={{ height: "calc(100vh - 180px)" }}>
						<Grid style={{ width: "97.5%", margin: "0 auto" }}>
							{gridContent}
						</Grid>
					</ScrollArea>
				</section>
			</>
		);
	}

	return (
		<main className="main-container">
			<section>
				<div className="main-upper-section" style={{ marginBottom: "0" }}>
					<h1>Application History</h1>
				</div>
				<Tabs value={activeTab} onChange={setActiveTab}>
					<Tabs.List>
						<Tabs.Tab value="all">All</Tabs.Tab>
						<Tabs.Tab value="Waiting for Response">
							Waiting for Response
						</Tabs.Tab>
						<Tabs.Tab value="Accepted">Accepted</Tabs.Tab>
						<Tabs.Tab value="Completed">Completed</Tabs.Tab>
						<Tabs.Tab value="Rejected">Rejected</Tabs.Tab>
					</Tabs.List>
					<Tabs.Panel value="all">{content}</Tabs.Panel>
					<Tabs.Panel value="Accepted">{content}</Tabs.Panel>
					<Tabs.Panel value="Waiting for Response">{content}</Tabs.Panel>
					<Tabs.Panel value="Completed">{content}</Tabs.Panel>
					<Tabs.Panel value="Rejected">{content}</Tabs.Panel>
				</Tabs>
			</section>
		</main>
	);
};

export default ApplicationHistory;
