import { Button, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./EmailVerification.css";

const EmailVerification = () => {
	const data = useLocation();
	const email = data?.state?.email || "";
	const [isResendDisabled, setIsResendDisabled] = useState(false);
	const [disableCount, setDisableCount] = useState(60);
	const [isVerified, setIsVerified] = useState(false);

	const resendVerificationEmail = async () => {
		try {
			await axios.post("/api/auth/resend-verification-email", { email });
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
			notifications.show({
				title: "Verification Email Sent",
				message:
					"Please check your email and click the link to verify your email address.",
				color: "green",
			});
		} catch (err) {
			if (err.response.data.message) {
				notifications.show({
					title: "Error",
					message:
						err.response.data.message ||
						"Something went wrong. Please try again later.",
					color: "red",
				});
			} else {
				notifications.show({
					title: "Error",
					message: "Something went wrong. Please try again later.",
					color: "red",
				});
			}
		}
	};

	useEffect(() => {
		axios
			.get(`/api/auth/check-email-verification/${email}`)
			.then((res) => {
				res.data.user.status === "active"
					? setIsVerified(true)
					: setIsVerified(false);
			})
			.catch((err) => console.log(err));
	}, [email]);

	return (
		<main
			style={{
				display: "flex",
				alignItems: "center",
				height: "100vh",
			}}
		>
			<section className="bordered-center-form">
				<div style={{ width: "175px", margin: "0 auto" }}>
					<img
						src="./images/er-horizontal.svg"
						alt="easyrent logo"
						width="100%"
					/>
				</div>

				<div style={{ width: "fit-content", margin: "0 auto" }}>
					{isVerified ? (
						<>
							<Title
								order={1}
								size="h2"
								style={{ lineHeight: "1", margin: "2rem 0 1rem 0" }}
							>
								Email Confirmed
							</Title>
							<Text size="lg">
								You have successfully verified your email address. To start
								using our services, click the button below to login.
							</Text>
							<div style={{ textAlign: "center" }}>
								<Button component="a" href="/login" variant="er-blue">
									Login
								</Button>
							</div>
						</>
					) : (
						<>
							<Title
								order={1}
								size="h2"
								style={{ lineHeight: "1", margin: "2rem 0 1rem 0" }}
							>
								Verify your email address
							</Title>
							<Text size="lg">
								To start using our services, confirm your email address by
								clicking the link we have sent to:
							</Text>
							<Text size="lg" fw={700} style={{ marginBottom: "2rem" }}>
								{email ? email : "No email found"}
							</Text>
							<div style={{ textAlign: "center" }}>
								<Button
									type="button"
									variant="er-blue"
									onClick={resendVerificationEmail}
									disabled={isResendDisabled}
								>
									Resend Verification Email
								</Button>
							</div>
						</>
					)}
				</div>
				{isResendDisabled && (
					<Text style={{ marginTop: "0.5rem", textAlign: "center" }}>
						Please wait {disableCount} to resend the verification email again!
					</Text>
				)}
			</section>
		</main>
	);
};

export default EmailVerification;
