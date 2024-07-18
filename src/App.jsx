import "./App.css";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import AboutUs from "./pages/AboutUs/AboutUs";
import EmailVerification from "./pages/EmailVerification/EmailVerification";
import Faq from "./pages/Faq/Faq";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import RegisterConfirmation from "./pages/RegisterConfirmation/RegisterConfirmation";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<Home />} />
				<Route path="faq" element={<Faq />} />
				<Route path="about-us" element={<AboutUs />} />
			</Route>
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />
			<Route path="/email-verification" element={<EmailVerification />} />
			<Route
				path="/register-confirmation/:confirmationCode"
				element={<RegisterConfirmation />}
			/>
			<Route path="*" element={<h1>404</h1>} />
		</Routes>
	);
}

export default App;
