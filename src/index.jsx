import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { MantineProvider } from '@mantine/core';
// import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MantineProvider>
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
