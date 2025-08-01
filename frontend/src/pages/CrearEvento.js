import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CrearEvento.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


function CrearEventoPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    categoria: "",
    fecha: "",
    precio: "",
    capacidad: "",
    ubicacion: "",
    imagen: ""
  });

  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("usuario");
    if (user) {
      setUsuario(user);
    } else {
      alert("Debes iniciar sesión para crear eventos");
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
  const { name, value } = e.target;

  const newValue =
  name === "precio" ? (value === "" ? 0 : parseFloat(value)) :
  name === "capacidad" ? (value === "" ? 0 : parseInt(value)) :
  value;

  setFormData({ ...formData, [name]: newValue });
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, ...formularioSinId } = formData; // eliminamos el id si existe
    const eventoConCreador = { ...formularioSinId, creador: usuario };


    try {
      const res = await fetch(`${BACKEND_URL}/api/eventos/crear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventoConCreador)
      });

      if (res.ok) {
        alert("Evento creado correctamente");
        navigate("/"); 
      } else {
        const errorMsg = await res.text();
        alert("Error al crear el evento: " + errorMsg);
      }
    } catch (error) {
      console.error("Error al enviar el evento:", error);
      alert("Error de conexión con el servidor.");
    }
  };

  return (
    <div className="crear-evento-page">
      <div className="crear-evento-formulario">
      <h2>Crear nuevo evento</h2>
      <form onSubmit={handleSubmit}>
        <input name="nombre" placeholder="Nombre del evento" onChange={handleChange} required />
        <textarea name="descripcion" placeholder="Descripción" onChange={handleChange} required />
        <select name="categoria" value={formData.categoria} onChange={handleChange} required>
          <option value="">Selecciona una categoría</option>
          <option value="Música">Música</option>
          <option value="Deporte">Deporte</option>
          <option value="Vida Nocturna">Vida Nocturna</option>
          <option value="Vacaciones">Vacaciones</option>
          <option value="Videojuegos">Videojuegos</option>
          <option value="Gastronomía">Gastronomía</option>
          <option value="Negocios">Negocios</option>
          <option value="Quedadas">Quedadas</option>
          <option value="Online">Online</option>
          <option value="Otras">Otras</option>
        </select>
        <input name="fecha" type="date" onChange={handleChange} required />
        <input name="precio" type="number" placeholder="Precio (€)" onChange={handleChange} required />
        <input name="capacidad" type="number" placeholder="Capacidad" onChange={handleChange} required />
        <input name="ubicacion" placeholder="Ubicación" onChange={handleChange} required />
        <input name="imagen" placeholder="URL de imagen" onChange={handleChange} />
        <button type="submit">Crear evento</button>
      </form>
    </div>
    </div>
  );
}

export default CrearEventoPage;

