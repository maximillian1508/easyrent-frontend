/* eslint-disable react/react-in-jsx-scope */
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Layout from './components/Layout/Layout';
import Faq from './pages/Faq/Faq';
import Contacts from './pages/Contacts/Contacts';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="faq" element={<Faq />} />
        <Route path="contacts" element={<Contacts />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<h1>404</h1>} />
    </Routes>
  );
}

export default App;
