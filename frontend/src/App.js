import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import CrearEventoPage from "./pages/CrearEvento";
import EventoDetalle from './pages/EventoDetalle';
import MisEventos from './pages/MisEventos';
import ModificarEvento from "./pages/ModificarEvento";



function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />

        <main style={{ minHeight: "80vh", padding: "1rem" }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/crear-evento" element={<CrearEventoPage />} />
            <Route path="/evento/:id" element={<EventoDetalle />} />
            <Route path="/mis-eventos" element={<MisEventos />} />
            <Route path="/modificar-evento/:id" element={<ModificarEvento />} />

          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
