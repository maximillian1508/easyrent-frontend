import { Button, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./RegisterConfirmation.css";

const RegisterConfirmation = () => {
	const [error, setError] = useState("");
	const [isResendDisabled, setIsResendDisabled] = useState(false);
	const [disableCount, setDisableCount] = useState(60);

	let template;

	const navigate = useNavigate();
	const params = useParams();
	const effectRan = useRef(false);

	const resendVerificationEmail = async () => {
		try {
			await axios.post("/api/auth/resend-verification-email", {
				confirmationCode: params.confirmationCode,
			});

			setIsResendDisabled(true);
			let counter = disableCount;
			setTimeout(() => {
				setIsResendDisabled(false);
			}, 60000);

			const countdown = setInterval(() => {
				counter--;
				setDisableCount(counter);
				if (counter === 0) {
					clearInterval(countdown);
					setDisableCount(60);
				}
			}, 1000);
		} catch (err) {
			if (err.response.data.message) {
				notifications.show({
					title: "Error",
					message:
						err.response.data.message ||
						"Something went wrong. Please try again later.",
					color: "red",
				});
				setError(
					err.response.data.message ||
					"Something went wrong. Please try again later.",
				);
			} else {
				notifications.show({
					title: "Error",
					message: "Something went wrong. Please try again later.",
					color: "red",
				});
				setError(`${err.response.status} ${err.response.statusText}`);
			}
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (effectRan.current === false) {
			axios
				.get(`/api/auth/verify-user/${params.confirmationCode}`)
				.catch((err) => {
					if (err.response.data.message) {
						notifications.show({
							title: "Error",
							message:
								err.response.data.message ||
								"Something went wrong. Please try again later.",
							color: "red",
						});
						setError(
							err.response.data.message ||
							"Something went wrong. Please try again later.",
						);
					} else {
						notifications.show({
							title: "Error",
							message: "Something went wrong. Please try again later.",
							color: "red",
						});
						setError(`${err.response.status} ${err.response.statusText}`);
					}
				});

			return () => {
				effectRan.current = true;
			};
		}
	}, []);

	if (!error) {
		template = (
			<div style={{ textAlign: "center" }}>
				<Text c="green">Your email has been verified!</Text>
				<Button variant="er-blue" onClick={() => navigate("/login")} mt="1rem">
					Login
				</Button>
			</div>
		);
	} else if (error === "User Not found.") {
		template = (
			<div style={{ textAlign: "center" }}>
				<Text c="red">{error}</Text>
				<p>User with this verification code not found! </p>
				<p>Please check whether you have registered/verified your account</p>
				<p>Otherwise, check for the latest verification email</p>
				<Button variant="er-blue" onClick={() => navigate("/login")} mt="1rem">
					Login
				</Button>
			</div>
		);
	} else if (error === "Confirmation Code Expired!") {
		template = (
			<div
				style={{ width: "fit-content", margin: "0 auto", textAlign: "center" }}
			>
				<Text c="red">{error}</Text>
				<p>Please resend the verification email by clicking the button below</p>
				<Button
					type="button"
					variant="er-blue"
					onClick={resendVerificationEmail}
					disabled={isResendDisabled}
				>
					Resend Verification Email
				</Button>
			</div>
		)(isResendDisabled) && (
				<Text style={{ marginTop: "0.5rem", textAlign: "center" }}>
					Please wait {disableCount} to resend the verification email again!
				</Text>
			);
	} else {
		template = (
			<div style={{ textAlign: "center" }}>
				<Text c="red">{error}</Text>
				{error === "502 Bad Gateway" || error === "No changes made." ? (
					<></>
				) : (
					<Button
						variant="er-blue"
						onClick={() => {
							navigate("/register");
						}}
					>
						Retry Register
					</Button>
				)}
			</div>
		);
	}

	return (
		<main style={{ height: "100vh", display: "flex", alignItems: "center" }}>
			<section className="bordered-center-form reg-confirm">
				<div style={{ width: "175px", margin: "0 auto" }}>
					<img
						src="/images/er-horizontal.svg"
						alt="easyrent logo"
						width="100%"
					/>
				</div>
				<Title
					order={1}
					size="h2"
					style={{
						lineHeight: "1",
						margin: "2rem 0 1rem 0",
						textAlign: "center",
					}}
				>
					Email Confirmation
				</Title>
				{template}
			</section>
		</main>
	);
};

export default RegisterConfirmation;
