import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "./HomePage.css";

function HomePage() {
  const [eventos, setEventos] = useState([]);
  const [categoria, setCategoria] = useState("");
  const [precio, setPrecio] = useState("");
  const [fecha, setFecha] = useState("");
  const [ciudad, setCiudad] = useState("");
  const navigate = useNavigate();

  const location = useLocation();
  const hoy = new Date().toISOString().split("T")[0]; 


  const buscarEventos = (ciudadParam = ciudad) => {
    const params = new URLSearchParams();
    if (categoria) params.append("categoria", categoria);
    if (precio) params.append("precio", precio);
    if (fecha) params.append("fecha", fecha);
    if (ciudadParam) params.append("ciudad", ciudadParam);

    fetch(`http://localhost:8080/api/eventos/busqueda?${params.toString()}`)
      .then(res => res.json())
      .then(data => setEventos(data))
      .catch(err => console.error("Error al buscar eventos:", err));
  };

  useEffect(() => {
  const ciudadGuardada = localStorage.getItem("ciudadSeleccionada");
  if (ciudadGuardada) {
    setCiudad(ciudadGuardada);
    buscarEventos(ciudadGuardada);
  } else {
    setCiudad("");
    fetch("http://localhost:8080/api/eventos/listar")
      .then((res) => res.json())
      .then((data) => setEventos(data))
      .catch((err) => console.error("Error al cargar eventos:", err));
  }
}, [location]);

  return (
    <div>
      
      <div className="hero-section">
        <div className="hero-text">
          <h2>Disfruta de tu tiempo libre</h2>
          <p>Comparte momentos únicos asistiendo a eventos cerca de ti</p>
        </div>
        <div className="hero-image">
          <img src="/imagenes/home1.jpg" alt="Evento ejemplo" />
        </div>
      </div>

      <div className="home-container">
        {/* COLUMNA IZQUIERDA: filtros */}
        <aside className="filtros">
          <h2>Buscar por categoría</h2>
          {["Música", "Deporte", "Vida Nocturna", "Vacaciones", "Videojuegos", "Gastronomía", "Negocios", "Quedadas", "Online", "Otras"].map(cat => (
            <p
              key={cat}
              className={categoria === cat ? "activo" : ""}
              onClick={() => setCategoria(cat)}
              style={{ cursor: "pointer" }}
            >
              {cat}
            </p>
          ))}

          <h2>Buscar por precio</h2>
          {["Gratis", "1-10", "10-25", "25-50", "50-100", "100+"].map(p => (
            <p
              key={p}
              className={precio === p ? "activo" : ""}
              onClick={() => setPrecio(p)}
              style={{ cursor: "pointer" }}
            >
              {p === "100+" ? "Más de 100€" : p === "Gratis" ? "Gratis" : `${p}€`}
            </p>
          ))}

          <h2>Buscar por fecha</h2>
          {["Hoy", "Mañana", "Esta semana", "Este mes", "Dentro de un mes"].map(f => (
            <p
              key={f}
              className={fecha === f ? "activo" : ""}
              onClick={() => setFecha(f)}
              style={{ cursor: "pointer" }}
            >
              {f}
            </p>
          ))}


          <button onClick={() => buscarEventos()}>Buscar</button>
          <button
            onClick={() => {
              setCategoria("");
              setPrecio("");
              setFecha("");
              const ciudadGuardada = localStorage.getItem("ciudadSeleccionada") || "";
              setCiudad(ciudadGuardada);
              if (ciudadGuardada) {
                buscarEventos(ciudadGuardada);
              } else {
                fetch("http://localhost:8080/api/eventos/listar")
                  .then((res) => res.json())
                  .then((data) => setEventos(data));
              }
            }}
            style={{ marginTop: "10px" }}
          >
            Restablecer filtros
        </button>

        </aside>

        {/* COLUMNA DERECHA: eventos */}
        <section className="eventos">
  <h2>Eventos disponibles {ciudad ? ` en ${ciudad}` : ""}</h2>
  <div className="eventos-grid">
    {eventos.length > 0 ? (
      eventos
        .filter(evento => evento.fecha >= new Date().toISOString().split("T")[0])
        .map((evento) => (
          <div className="evento-card" key={evento.id}>
            <img src={evento.imagen} alt={evento.nombre} />
            <h3>{evento.nombre}</h3>
            <p className="categoria">{evento.categoria}</p>
            <p className="fecha">{evento.fecha}</p>
            <button onClick={() => navigate(`/evento/${evento.id}`)}>
              Más información
            </button>
          </div>
        ))
    ) : (
      <p>No hay eventos disponibles todavía...</p>
    )}
  </div>
</section>

      </div>
    </div>
  );
}

export default HomePage;
