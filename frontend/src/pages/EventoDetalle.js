import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./EventoDetalle.css";

function EventoDetalle() {
  const { id } = useParams();
  const [evento, setEvento] = useState(null);
  const [yaInscrito, setYaInscrito] = useState(false);
  const usuarioId = localStorage.getItem("usuarioId");
  const usuario = localStorage.getItem("usuario");
  const [creador, setCreador] = useState(null);

  useEffect(() => {
  fetch(`http://localhost:8080/api/eventos/${id}`)
    .then((res) => res.json())
    .then((data) => {
      setEvento(data);

      fetch(`http://localhost:8080/api/usuarios/por-nombre/${data.creador}`)
        .then((res) => res.json())
        .then((creadorData) => setCreador(creadorData))
        .catch((err) => console.error("Error al cargar datos del creador:", err));
    })
    .catch((err) => console.error("Error al cargar evento:", err));

  if (usuarioId) {
    fetch(`http://localhost:8080/api/inscripciones/comprobar?usuarioId=${usuarioId}&eventoId=${id}`)
      .then(res => res.json())
      .then(setYaInscrito);
  }
}, [id, usuarioId]);

  if (!evento) return <p>Cargando evento...</p>;
  const inscribirse = async () => {
  const confirmar = window.confirm("¿Quieres inscribirte a este evento?");
  if (!confirmar) return;
  const res = await fetch("http://localhost:8080/api/inscripciones/apuntarse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      usuarioId: parseInt(usuarioId),
      eventoId: parseInt(id)
    })
  });

  const msg = await res.text();
  alert(msg);

  if (msg === "Inscripción realizada correctamente.") {
    setYaInscrito(true);
    // Recargar datos actualizados del evento (para ver capacidad)
    fetch(`http://localhost:8080/api/eventos/${id}`)
      .then((res) => res.json())
      .then((data) => setEvento(data));
  }
};


  return (
    <div className="evento-detalle">
      <div className="imagen-grande">
        <img src={evento.imagen} alt={evento.nombre} />
      </div>
      <div className="info-evento">
        <h2>{evento.nombre}</h2>
        <p><strong>Categoría:</strong> {evento.categoria}</p>
        <p><strong>Descripción:</strong> {evento.descripcion}</p>
        <p><strong>Fecha:</strong> {evento.fecha}</p>
        <p><strong>Precio:</strong> {evento.precio}€</p>
        <p><strong>Capacidad:</strong> {evento.capacidad}</p>
        <p><strong>Ubicación:</strong> {evento.ubicacion}</p>
        <p>
  <strong>Organizado por:</strong>{" "}
  {creador ? (
    <>
      {creador.nombreUsuario} con valoración media de{" "}
      <strong>{creador.valoracionMedia?.toFixed(1) || "0.0"}/10</strong>, con{" "}
      <strong>{creador.numeroValoraciones || 0}</strong> eventos valorados
    </>
  ) : (
    evento.creador
  )}
</p>


        

        {usuario ? (
          yaInscrito ? (
            <p>✅ Ya estás inscrito en este evento</p>
          ) : evento.capacidad > 0 ? (
            <button onClick={inscribirse}>Apuntarse</button>
          ) : (
            <p>⛔ Este evento ya no tiene plazas disponibles.</p>
          )
        ) : (
          <p>🔐 Inicia sesión para apuntarte a este evento.</p>
        )}

      </div>
    </div>
  );
}

export default EventoDetalle;
