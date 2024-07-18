import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
	Button,
	MantineProvider,
	MultiSelect,
	createTheme,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "@mantine/carousel/styles.css";
// import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import buttonClasses from "./components/Button/Button.module.css";
import inputClasses from "./components/Input/Input.module.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

const theme = createTheme({
	components: {
		Button: Button.extend({
			classNames: buttonClasses,
		}),
		MultiSelect: MultiSelect.extend({
			classNames: inputClasses,
		}),
	},
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<MantineProvider theme={theme}>
			<Notifications position="top-center" />
			<ModalsProvider>
				<BrowserRouter>
					<Routes>
						<Route path="/*" element={<App />} />
					</Routes>
				</BrowserRouter>
			</ModalsProvider>
		</MantineProvider>
	</React.StrictMode>,
);
