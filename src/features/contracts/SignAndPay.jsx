import {
	Button,
	FileInput,
	LoadingOverlay,
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
	useProcessDepositMutation,
} from "../transactions/transactionsApiSlice";
import {
	useGetContractsQuery,
	useUploadSignedContractMutation,
} from "./contractsApiSlice";

const stripePromise = loadStripe(
	"pk_test_51ME3uJBM1IOj1wJGy1VN4rK1NTarr5O8GrmtMEaE22foBAnGP8Gx3AVOc27DOBtB6eHjcgsN0QKO2EgYV6yuArzC00RYwCoc7k",
);

const SignAndPayContent = ({ clientSecret }) => {
	useTitle("Sign and Pay");
	const { contractId } = useParams();
	const navigate = useNavigate();
	const [contractFile, setContractFile] = useState("");
	const [signedContractFile, setSignedContractFile] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [depositAmount, setDepositAmount] = useState(0);

	const errorNotif = (message) => {
		notifications.show({
			title: "Error",
			message: message,
			color: "red",
		});
	};

	const stripe = useStripe();
	const elements = useElements();

	const { contract, isLoading } = useGetContractsQuery("contractsList", {
		selectFromResult: ({ data, isLoading }) => ({
			contract: data?.entities[contractId],
			isLoading,
		}),
	});

	const [uploadSignedContract] = useUploadSignedContractMutation();
	const [processDeposit] = useProcessDepositMutation();

	useEffect(() => {
		if (contract) {
			setContractFile(contract.contractFile);
			setDepositAmount(contract.depositAmount);
		}
	}, [contract]);

	const handleSubmit = async (event) => {
		event.preventDefault();
		setIsSubmitting(true);
		setError("");

		if (!signedContractFile) {
			setError("Please upload the signed contract");
			errorNotif("Please upload the signed contract");
			setIsSubmitting(false);
			return;
		}

		if (!stripe || !elements) {
			setError("Stripe has not been initialized");
			errorNotif("Stripe has not been initialized");
			setIsSubmitting(false);
			return;
		}

		try {
			// Upload signed contract
			const formData = new FormData();
			formData.append("signedContract", signedContractFile);

			const uploadResult = await uploadSignedContract({ contractId, formData });

			if ("error" in uploadResult) {
				throw new Error("Failed to upload signed contract");
			}

			// Confirm the payment
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
				throw new Error(stripeError.message);
			}

			if (paymentIntent.status === "succeeded") {
				// Payment succeeded without redirect
				await processDeposit({
					paymentIntentId: paymentIntent.id,
					contractId: contractId,
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
			setError(err.message);
			errorNotif(err.message);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoading) {
		return <LoadingOverlay visible={true} />;
	}

	return (
		<main className="main-container">
			<Button
				variant="outline"
				color="black"
				onClick={() => {
					navigate(-1);
				}}
				leftSection={
					<ThemeIcon variant="transparent">
						<img src="/images/back.svg" style={{ width: "90%" }} alt="back" />
					</ThemeIcon>
				}
				mb="1rem"
			>
				Go Back
			</Button>
			<form
				style={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between",
				}}
				onSubmit={handleSubmit}
			>
				<div
					style={{
						width: "47.5%",
						backgroundColor: "var(--superlight-grey)",
						borderRadius: "7px",
						padding: "1rem 1.5rem",
					}}
				>
					<Title order={2} size="h2" mb="0.25rem">
						Sign the contract
					</Title>
					<Text c="dimmed" size="1.1rem" style={{ lineHeight: "1.2" }}>
						Review and sign the rental contract before proceeding with payment.
					</Text>
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							marginTop: "1.5rem",
							gap: "1rem",
						}}
					>
						<div style={{ width: "50%" }}>
							<Title order={3} size="h3" mb="0.25rem" fw="500">
								Rental Contract
							</Title>
							<Text c="dimmed" style={{ lineHeight: "1.2" }}>
								Terms and conditions for the rental.
							</Text>
						</div>
						<div>
							<Button
								variant="default"
								component="a"
								href={`${contractFile}`}
								target="_blank"
								w="fit-content"
								leftSection={
									<ThemeIcon variant="transparent">
										<img
											src="/images/download.svg"
											alt="download"
											style={{ width: "70%" }}
										/>
									</ThemeIcon>
								}
							>
								Download
							</Button>
						</div>
					</div>
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							marginTop: "1.5rem",
							gap: "1rem",
						}}
					>
						<div style={{ width: "50%" }}>
							<Title order={3} size="h3" mb="0.25rem" fw="500">
								Signed Contract
							</Title>
							<Text c="dimmed" style={{ lineHeight: "1.2" }}>
								Upload your signed contract.
							</Text>
						</div>
						<div>
							<FileInput
								placeholder="Upload contract"
								onChange={setSignedContractFile}
								accept="application/pdf"
								clearable
								leftSection={
									<ThemeIcon variant="transparent">
										<img
											src="/images/upload.svg"
											alt="upload"
											style={{ width: "70%" }}
										/>
									</ThemeIcon>
								}
							/>
						</div>
					</div>
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							marginTop: "1.5rem",
							gap: "1rem",
						}}
					>
						<div style={{ width: "50%" }}>
							<Title order={3} size="h3" mb="0.25rem" fw="500">
								Deposit Amount
							</Title>
							<Text c="dimmed" style={{ lineHeight: "1.2" }}>
								Payable Deposit Amount (Inc. 1st month rent)
							</Text>
						</div>
						<div>
							<Title order={4} size="h3">
								RM{depositAmount}
							</Title>
						</div>
					</div>
				</div>
				<div
					style={{
						width: "47.5%",
						backgroundColor: "var(--superlight-grey)",
						borderRadius: "7px",
						padding: "1rem 1.5rem",
					}}
				>
					<Title order={2} size="h2" mb="0.25rem">
						Payment
					</Title>
					<Text
						c="dimmed"
						size="1.1rem"
						style={{ lineHeight: "1.2", marginBottom: "1rem" }}
					>
						Enter your payment details to finalize the rental transaction.
					</Text>
					<PaymentElement options={{ layout: "tabs" }} />
					<Button
						variant="er-blue"
						type="submit"
						disabled={
							isSubmitting || !stripe || !elements || !signedContractFile
						}
						w="100%"
						mt="1rem"
					>
						{isSubmitting ? "Processing..." : "Submit and Pay"}
					</Button>
					{error && <Text color="red">{error}</Text>}
				</div>
			</form>
		</main>
	);
};

const SignAndPay = () => {
	const [clientSecret, setClientSecret] = useState("");
	const { contractId } = useParams();

	const { contract } = useGetContractsQuery("contractsList", {
		selectFromResult: ({ data }) => ({
			contract: data?.entities[contractId],
		}),
	});

	const [createPaymentIntent] = useCreatePaymentIntentMutation();

	useEffect(() => {
		const initPaymentIntent = async () => {
			if (contract) {
				try {
					const result = await createPaymentIntent({
						amount: contract.depositAmount,
						contractId,
					}).unwrap();
					setClientSecret(result.clientSecret);
				} catch (error) {
					console.error("Error creating PaymentIntent:", error);
				}
			}
		};

		initPaymentIntent();
	}, [contract, contractId, createPaymentIntent]);

	if (!clientSecret) {
		return <LoadingOverlay visible={true} />;
	}

	return (
		<Elements
			stripe={stripePromise}
			options={{ clientSecret, appearance: { theme: "stripe" } }}
		>
			<SignAndPayContent clientSecret={clientSecret} />
		</Elements>
	);
};

export default SignAndPay;
