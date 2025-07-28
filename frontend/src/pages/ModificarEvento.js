import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CrearEvento.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


function ModificarEventoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    categoria: "",
    fecha: "",
    precio: "",
    capacidad: "",
    ubicacion: "",
    imagen: "",
    creador: ""
  });

  
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/eventos/${id}`)
      .then((res) => res.json())
      .then((data) => setFormData(data))
      .catch(() => alert("Error al cargar el evento"));
  }, [id]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BACKEND_URL}/api/eventos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Evento modificado correctamente");
        navigate("/mis-eventos");
      } else {
        alert("Error al modificar el evento");
      }
    } catch (error) {
      console.error("Error al modificar el evento:", error);
      alert("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="crear-evento-page">
      <div className="crear-evento-formulario">
        <h2>Modificar evento</h2>
        <form onSubmit={handleSubmit}>
          <input name="nombre" value={formData.nombre} onChange={handleChange} required />
          <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} required />
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
          <input name="fecha" type="date" value={formData.fecha} onChange={handleChange} required />
          <input name="precio" type="number" value={formData.precio} onChange={handleChange} required />
          <input name="capacidad" type="number" value={formData.capacidad} onChange={handleChange} required />
          <input name="ubicacion" value={formData.ubicacion} onChange={handleChange} required />
          <input name="imagen" value={formData.imagen} onChange={handleChange} />
          <button type="submit">Guardar cambios</button>
        </form>
      </div>
    </div>
  );
}

export default ModificarEventoPage;
