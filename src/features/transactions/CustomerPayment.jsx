import {
	Button,
	Container,
	LoadingOverlay,
	Paper,
	Text,
	ThemeIcon,
	Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
	Elements,
	PaymentElement,
	useElements,
	useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useTitle from "../../hooks/useTitle";
import {
	useCreatePaymentIntentMutation,
	useGetTransactionsQuery,
	useProcessPaymentMutation,
} from "./transactionsApiSlice";

const stripePromise = loadStripe(
	"pk_test_51ME3uJBM1IOj1wJGy1VN4rK1NTarr5O8GrmtMEaE22foBAnGP8Gx3AVOc27DOBtB6eHjcgsN0QKO2EgYV6yuArzC00RYwCoc7k",
);

const PaymentContent = ({ amount, transactionId }) => {
	useTitle("Payment");
	const navigate = useNavigate();
	const stripe = useStripe();
	const elements = useElements();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

	const errorNotif = (message) => {
		notifications.show({
			title: "Error",
			message: message,
			color: "red",
		});
	};

	const [processPayment] = useProcessPaymentMutation();

	const handleSubmit = async (event) => {
		event.preventDefault();
		setIsSubmitting(true);
		setError("");

		if (!stripe || !elements) {
			setError("Stripe has not been initialized");
			setIsSubmitting(false);
			return;
		}

		try {
			

			const { error: stripeError, paymentIntent } = await stripe.confirmPayment(
				{
					elements,
					confirmParams: {
						return_url: `${window.location.origin}/payment-success`,
					},
					redirect: "if_required",
				},
			);
			

			if (stripeError) {
				console.error("Stripe error:", stripeError);

				throw new Error(stripeError.message);
			}

			if (paymentIntent.status === "succeeded") {
				// Payment succeeded without redirect
				
				await processPayment({
					paymentIntentId: paymentIntent.id,
					transactionId,
				});
				
				navigate(`/payment-success/${paymentIntent.id}`);
			} else {
				// For cases where additional actions might be required
				

				stripe.confirmPayment({
					elements,
					confirmParams: {
						return_url: `${window.location.origin}/payment-success/${paymentIntent.id}`,
					},
					redirect: "if_required",
				});
			}
		} catch (err) {
			console.error("Error in handleSubmit:", err);

			setError(err.message);
			errorNotif(err.message);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Container size="sm" py="xl">
			<Button
				variant="outline"
				color="black"
				onClick={() => navigate(-1)}
				leftSection={
					<ThemeIcon variant="transparent">
						<img src="/images/back.svg" style={{ width: "90%" }} alt="back" />
					</ThemeIcon>
				}
				mb="xl"
			>
				Go Back
			</Button>

			<Paper shadow="md" radius="md" p="xl" withBorder>
				<Title order={2} align="center" mb="md">
					Payment
				</Title>
				<Text align="center" size="lg" weight={700} mb="xl">
					Amount: RM {amount}
				</Text>
				<form onSubmit={handleSubmit}>
					<PaymentElement options={{ layout: "tabs" }} />
					<Button
						variant="er-blue"
						type="submit"
						fullWidth
						mt="xl"
						disabled={isSubmitting || !stripe || !elements}
					>
						{isSubmitting ? "Processing..." : "Pay Now"}
					</Button>
					{error && (
						<Text color="red" mt="sm">
							{error}
						</Text>
					)}
				</form>
			</Paper>
		</Container>
	);
};

const CustomerPayment = () => {
	const [clientSecret, setClientSecret] = useState("");
	const [amount, setAmount] = useState(0);
	const { transactionId } = useParams();

	const { transaction, isLoading, isError } = useGetTransactionsQuery(
		"transactionsList",
		{
			selectFromResult: ({ data, isLoading, isError }) => ({
				transaction: data?.entities[transactionId],
				isLoading,
				isError,
			}),
		},
	);

	const [createPaymentIntent] = useCreatePaymentIntentMutation();

	useEffect(() => {
		
		
		
	}, [transaction, isLoading, isError]);

	useEffect(() => {
		const initPaymentIntent = async () => {
			if (transaction) {
				try {
					

					const result = await createPaymentIntent({
						amount: transaction.amount,
						transactionId,
					}).unwrap();
					

					setClientSecret(result.clientSecret);
					setAmount(transaction.amount);
				} catch (error) {
					console.error("Error creating PaymentIntent:", error);
				}
			}
		};

		initPaymentIntent();
	}, [transaction, transactionId, createPaymentIntent]);

	if (isLoading) {
		return <LoadingOverlay visible={true} />;
	}

	if (isError) {
		return <div>Error loading transaction data</div>;
	}

	if (!transaction || !clientSecret) {
		return <LoadingOverlay visible={true} />;
	}

	return (
		<Elements
			stripe={stripePromise}
			options={{ clientSecret, appearance: { theme: "stripe" } }}
		>
			<PaymentContent amount={amount} transactionId={transactionId} />
		</Elements>
	);
};

export default CustomerPayment;
