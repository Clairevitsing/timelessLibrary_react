import React from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import { Outlet } from 'react-router-dom'; 
import { ToastContainer } from 'react-toastify';
import { UserProvider } from './context/useAuth';
import Footer from './components/Footer/Footer';


function App() {
  return (
    <UserProvider>
      <Navbar />
      
      <Outlet /> 
      <ToastContainer />
      <Footer />
    </UserProvider>
  );
}

export default App;