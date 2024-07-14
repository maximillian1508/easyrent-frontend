import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Button, MantineProvider, createTheme } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
// import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import classes from "./components/Button/Button.module.css";
import "@mantine/core/styles.css";

const theme = createTheme({
	components: {
		Button: Button.extend({
			classNames: classes,
		}),
	},
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<MantineProvider theme={theme}>
			<ModalsProvider>
				<Notifications />
				<BrowserRouter>
					<Routes>
						<Route path="/*" element={<App />} />
					</Routes>
				</BrowserRouter>
			</ModalsProvider>
		</MantineProvider>
	</React.StrictMode>,
);
