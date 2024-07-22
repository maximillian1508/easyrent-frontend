import "./App.css";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import DashboardLayout from "./components/DashboardLayout/DashboardLayout";
import Layout from "./components/Layout/Layout";
import { USERTYPE } from "./config/UserType";
import Login from "./features/auth/Login";
import PersistLogin from "./features/auth/PersistLogin";
import Prefetch from "./features/auth/Prefetch";
import PublicRoute from "./features/auth/PublicRoute";
import RequireAuth from "./features/auth/RequireAuth";
import AddNewProperty from "./features/properties/AddNewProperty";
import EditProperty from "./features/properties/EditProperty";
import ListingDetails from "./features/properties/ListingDetails";
import ManageProperties from "./features/properties/ManageProperties";
import PropertyDetails from "./features/properties/PropertyDetails";
import PropertyListing from "./features/properties/PropertyListing";
import ManageUsers from "./features/users/ManageUsers";
import Profile from "./features/users/Profile";
import AboutUs from "./pages/AboutUs/AboutUs";
import EmailVerification from "./pages/EmailVerification/EmailVerification";
import Faq from "./pages/Faq/Faq";
import Home from "./pages/Home/Home";
import Register from "./pages/Register/Register";
import RegisterConfirmation from "./pages/RegisterConfirmation/RegisterConfirmation";

function App() {
	return (
		<Routes>
			{/* persist login here because customer still need to access the public routes */}
			<Route element={<PersistLogin />}>
				{/*public routes*/}
				<Route element={<PublicRoute />}>
					<Route path="/" element={<Layout />}>
						<Route index element={<Home />} />
						<Route path="faq" element={<Faq />} />
						<Route path="about-us" element={<AboutUs />} />
						<Route path="listing" element={<PropertyListing />} />
						<Route path="listing/:propertyId" element={<ListingDetails />} />
					</Route>
				</Route>

				{/*protected routes*/}
				<Route
					element={
						<RequireAuth allowedTypes={[USERTYPE.CUSTOMER, USERTYPE.ADMIN]} />
					}
				>
					<Route element={<Prefetch />}>
						<Route element={<DashboardLayout />}>
							<Route path="dashboard" element={<Dashboard />} />
							<Route path="profile" element={<Profile />} />
							{/*
							<Route
								element={<RequireAuth allowedTypes={[USERTYPE.CUSTOMER]} />}
							></Route>

							*/}
							<Route element={<RequireAuth allowedTypes={[USERTYPE.ADMIN]} />}>
								<Route path="manage-users" element={<ManageUsers />} />
								<Route path="manage-properties">
									<Route index element={<ManageProperties />} />
									<Route path="add" element={<AddNewProperty />} />
									<Route
										path="details/:propertyId"
										element={<PropertyDetails />}
									/>
									<Route path="edit/:propertyId" element={<EditProperty />} />
								</Route>
							</Route>
						</Route>
					</Route>
				</Route>
			</Route>

			{/* auth routes */}
			<Route path="login" element={<Login />} />
			<Route path="register" element={<Register />} />
			<Route path="email-verification" element={<EmailVerification />} />
			<Route
				path="register-confirmation/:confirmationCode"
				element={<RegisterConfirmation />}
			/>
			<Route path="*" element={<h1>404</h1>} />
		</Routes>
	);
}

export default App;
