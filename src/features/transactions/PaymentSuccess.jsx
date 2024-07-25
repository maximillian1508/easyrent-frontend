import {
	Button,
	Container,
	LoadingOverlay,
	Paper,
	Text,
	ThemeIcon,
	Title,
} from "@mantine/core";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useTitle from "../../hooks/useTitle";

const PaymentSuccess = () => {
	useTitle("Payment Status");
	const { paymentIntentId } = useParams();
	const navigate = useNavigate();
	const [paymentStatus, setPaymentStatus] = useState("loading");
	const [message, setMessage] = useState("");

	useEffect(() => {
		const checkPaymentStatus = async () => {
			if (!paymentIntentId) {
				setPaymentStatus("failed");
				setMessage("Payment verification failed. Please contact support.");
				return;
			}

			try {
				const response = await axios.get(
					`/api/transactions/payment-intent-status/${paymentIntentId}`,
				);
				const { status } = response.data;

				switch (status) {
					case "succeeded":
						setPaymentStatus("succeeded");
						setMessage(
							"Your payment was successful. Thank you for your purchase!",
						);
						break;
					case "processing":
						setPaymentStatus("processing");
						setMessage(
							"Your payment is processing. We'll update you when payment is received.",
						);
						break;
					case "requires_payment_method":
						setPaymentStatus("failed");
						setMessage("Your payment was not successful, please try again.");
						break;
					default:
						setPaymentStatus("failed");
						setMessage("Something went wrong. Please contact support.");
						break;
				}
			} catch (error) {
				console.error("Error retrieving payment intent:", error);
				setPaymentStatus("failed");
				setMessage(
					"An error occurred while verifying your payment. Please contact support.",
				);
			}
		};

		checkPaymentStatus();
	}, [paymentIntentId]);

	const getIcon = () => {
		switch (paymentStatus) {
			case "succeeded":
				return (
					<ThemeIcon variant="transparent">
						<img
							src="/images/check.svg"
							alt="check"
							style={{ width: "100%" }}
						/>
					</ThemeIcon>
				);
			case "processing":
				return (
					<ThemeIcon variant="transparent">
						<img
							src="/images/loading.svg"
							alt="loading"
							style={{ width: "100%" }}
						/>
					</ThemeIcon>
				);
			case "failed":
				return (
					<ThemeIcon variant="filled" color="red">
						<img
							src="/images/alert-circle.svg"
							alt="alert"
							style={{ width: "100%" }}
						/>
					</ThemeIcon>
				);
			default:
				return null;
		}
	};

	if (paymentStatus === "loading") {
		return <LoadingOverlay visible={true} />;
	}

	return (
		<Container size="sm" py="xl">
			<Paper shadow="md" p="xl" withBorder>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						marginBottom: "1rem",
					}}
				>
					{getIcon()}
					<Title order={2} ml="md">
						Payment Status
					</Title>
				</div>
				<Text size="lg" mb="xl">
					{message}
				</Text>
				<Button
					variant="er-blue"
					color={paymentStatus === "succeeded" ? "green" : "blue"}
					onClick={() => navigate("/dashboard")}
					fullWidth
				>
					Return to Dashboard
				</Button>
			</Paper>
		</Container>
	);
};

export default PaymentSuccess;
