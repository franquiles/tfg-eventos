import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [usuario, setUsuario] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [ciudad, setCiudad] = useState("");


  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    setUsuario(usuarioGuardado);

    const ciudadGuardada = localStorage.getItem("ciudadSeleccionada");
    if (ciudadGuardada) {
      setCiudad(ciudadGuardada);
    }
  }, [location]);

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
    navigate("/");
  };

  const buscarEventos = () => {
  if (ciudad.trim() === "") {
    localStorage.removeItem("ciudadSeleccionada");
  } else {
    localStorage.setItem("ciudadSeleccionada", ciudad.trim());
  }
  navigate("/");
};



  return (
    <nav className="navbar">
      <div className="logo-buscador">
        <h1>Eventos España</h1>
        <div className="buscador-ciudad">
          <input
            type="text"
            placeholder="Buscar ciudad..."
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
          />
          <button onClick={buscarEventos}>🔍</button>
        </div>
      </div>
      <div className="nav-links">
        {usuario ? (
  <>
    <Link to="/crear-evento">
    <button className="crear-evento-btn">Crear evento</button>
    </Link>
    <div className="usuario-inicio">
    <Link to="/">Inicio</Link>  
    </div>
    <div className="usuario-menu">
      <span onClick={() => setMenuAbierto(!menuAbierto)} style={{ cursor: "pointer" }}>
        ¡Bienvenido, {usuario}! ▾
      </span>
      {menuAbierto && (
        <div className="dropdown-menu">
          <button onClick={() =>  navigate("/mis-eventos")}>
            Ver mis eventos
          </button>
          <button onClick={cerrarSesion}>Cerrar sesión</button>
        </div>
      )}
    </div>
  </>
) : (
  <>
    <Link to="/">Inicio</Link>  
    <Link to="/login">Iniciar sesión</Link>
    <Link to="/register">Registrarse</Link>
  </>
)}

      </div>
    </nav>
  );
}

export default Navbar;
