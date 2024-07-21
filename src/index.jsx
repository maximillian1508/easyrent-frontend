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
import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import { store } from "./app/store";
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
		<ReduxProvider store={store}>
			<MantineProvider theme={theme}>
				<Notifications position="top-center" autoClose={2500} zIndex={1000} />
				<ModalsProvider>
					<BrowserRouter>
						<Routes>
							<Route path="/*" element={<App />} />
						</Routes>
					</BrowserRouter>
				</ModalsProvider>
			</MantineProvider>
		</ReduxProvider>
	</React.StrictMode>,
);
