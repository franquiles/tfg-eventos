import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./MisEventos.css";

function MisEventos() {
  const [eventosCreados, setEventosCreados] = useState([]);
  const [eventosInscritos, setEventosInscritos] = useState([]);
  const [valoraciones, setValoraciones] = useState({});
  const usuarioId = localStorage.getItem("usuarioId");
  const [inscritosPorEvento, setInscritosPorEvento] = useState({});
  const [eventoAbierto, setEventoAbierto] = useState(null);
  const hoy = new Date().toISOString().split("T")[0];

  const [comentarioAbierto, setComentarioAbierto] = useState(null);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [comentariosPorEvento, setComentariosPorEvento] = useState({});
  const [comentariosAbiertos, setComentariosAbiertos] = useState({});
  const [numComentarios, setNumComentarios] = useState({});
  const [comentariosEnviados, setComentariosEnviados] = useState({});


  useEffect(() => {
    if (usuarioId) {
      fetch(`http://localhost:8080/api/inscripciones/inscritos/${usuarioId}`)
        .then(res => res.json())
        .then(data => setEventosInscritos(data))
        .catch(err => console.error("Error cargando eventos inscritos:", err));
    }
  }, [usuarioId]);

  useEffect(() => {
    const usuario = localStorage.getItem("usuario");
    if (usuario) {
      fetch(`http://localhost:8080/api/eventos/creados?usuario=${usuario}`)
        .then(res => res.json())
        .then(data => setEventosCreados(data))
        .catch(err => console.error("Error cargando eventos creados:", err));
    }
  }, []);
  const navigate = useNavigate();

  const handleEliminarEvento = async (id) => {
  const confirmar = window.confirm("¿Estás seguro de que quieres eliminar este evento?");
  if (confirmar) {
    const res = await fetch(`http://localhost:8080/api/eventos/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      alert("Evento eliminado correctamente");
      setEventosCreados(prev => prev.filter(evento => evento.id !== id));
    } else {
      alert("Error al eliminar el evento");
    }
  }
};

const verInscritos = async (eventoId) => {
  if (eventoAbierto === eventoId) {
    setEventoAbierto(null); 
    return;
  }
  const res = await fetch(`http://localhost:8080/api/inscripciones/evento/${eventoId}/usuarios`);
  const data = await res.json();
  setInscritosPorEvento(prev => ({ ...prev, [eventoId]: data }));
  setEventoAbierto(eventoId);
};



const handleDesapuntarse = async (eventoId) => {
  const confirmar = window.confirm("¿Seguro que quieres desapuntarte de este evento?");
  if (!confirmar) return;

  const res = await fetch(`http://localhost:8080/api/inscripciones/desapuntarse?usuarioId=${usuarioId}&eventoId=${eventoId}`, {
    method: "DELETE"
  });

  const msg = await res.text();
  alert(msg);

  if (res.ok) {
    // Quitar el evento de la lista visual
    setEventosInscritos(prev => prev.filter(evento => evento.id !== eventoId));
  }
};

const handleValorar = async (eventoId) => {
  const nota = prompt("Valora el evento del 1 al 10:");
  const valor = parseInt(nota);
  if (!valor || valor < 1 || valor > 10) {
    alert("Introduce un número válido del 1 al 10");
    return;
  }
  const res = await fetch(`http://localhost:8080/api/inscripciones/valorar`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      usuarioId,
      eventoId,
      valoracion: valor
    })
  });
  const msg = await res.text();
  alert(msg);
  if (res.ok) {
    setValoraciones(prev => ({ ...prev, [eventoId]: true }));
  }
};

const handleComentar = async (eventoId) => {
  if (!nuevoComentario.trim()) {
    alert("El comentario no puede estar vacío.");
    return;
  }
  const res = await fetch("http://localhost:8080/api/inscripciones/comentar", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      usuarioId,
      eventoId,
      comentario: nuevoComentario
    })
  });
  const msg = await res.text();
  alert(msg);
  if (res.ok) {
    setComentarioAbierto(null);
    setNuevoComentario("");
    setComentariosEnviados(prev => ({ ...prev, [eventoId]: true }));
    // Refrescar comentarios visibles
    if (comentariosAbiertos[eventoId]) {
      await toggleComentarios(eventoId); // cerrar
      await toggleComentarios(eventoId); // reabrir y refrescar
    }
  }
};


const toggleComentarios = async (eventoId) => {
  const abierto = comentariosAbiertos[eventoId];

  if (abierto) {
    setComentariosAbiertos(prev => ({ ...prev, [eventoId]: false }));
  } else {
    const res = await fetch(`http://localhost:8080/api/inscripciones/comentarios/${eventoId}`);
    const data = await res.json();

    setComentariosPorEvento(prev => ({ ...prev, [eventoId]: data }));
    setComentariosAbiertos(prev => ({ ...prev, [eventoId]: true }));
    setNumComentarios(prev => ({ ...prev, [eventoId]: data.length }));
  }
};


useEffect(() => {
  if (usuarioId) {
    fetch(`http://localhost:8080/api/inscripciones/usuario/${usuarioId}`)
      .then(res => res.json())
      .then(data => {
        const comentados = {};
        data.forEach(insc => {
          if (insc.comentario && insc.comentario.trim() !== "") {
            comentados[insc.eventoId] = true;
          }
        });
        setComentariosEnviados(comentados);
      })
      .catch(err => console.error("Error cargando comentarios previos:", err));
  }
}, [usuarioId]);


useEffect(() => {
  if (usuarioId) {
    fetch(`http://localhost:8080/api/inscripciones/usuario/${usuarioId}`)
      .then(res => res.json())
      .then(data => {
        const yaValorados = {};
        data.forEach(insc => {
          if (insc.valoracion !== null) {
            yaValorados[insc.eventoId] = true;
          }
        });
        setValoraciones(yaValorados);
      })
      .catch(err => console.error("Error cargando valoraciones previas:", err));
  }
}, [usuarioId]);





  return (
  <div className="mis-eventos-container">
    {/* IZQUIERDA - INSCRITOS */}
    <div className="columna">
      <h2>Eventos en los que estoy inscrito</h2>
      <div className="columna-eventos-grid">
        {eventosInscritos.length > 0 ? (
          eventosInscritos.map(evento => (
            <div key={evento.id} className="evento-card">
              <img src={evento.imagen} alt={evento.nombre} />
              <h3>{evento.nombre}</h3>
              <p>{evento.fecha}</p>
              <p>{evento.categoria}</p>
              {evento.fecha < hoy ? (
                <>
                  {/* Botón valorar */}
                  {valoraciones[evento.id] ? (
                    <p style={{ color: "green", fontWeight: "bold" }}>✅ Ya valorado, ¡gracias!</p>
                  ) : (
                    <button onClick={() => handleValorar(evento.id)}>Valorar</button>
                  )}


                  {/* Botón comentar */}
                  {comentariosEnviados[evento.id] ? (
                    <p style={{ color: "blue", fontWeight: "bold" }}>💬 Comentario enviado</p>
                  ) : (
                    <>
                      <button onClick={() => setComentarioAbierto(evento.id)}>Comentar</button>
                      {comentarioAbierto === evento.id && (
                        <div className="comentario-form">
                          <textarea
                            value={nuevoComentario}
                            onChange={(e) => setNuevoComentario(e.target.value)}
                            placeholder="Escribe tu comentario..."
                            rows={3}
                            style={{ width: "100%", marginTop: "5px" }}
                          />
                          <button onClick={() => handleComentar(evento.id)}>Enviar comentario</button>
                        </div>
                      )}
                    </>
                  )}
                  {/* Valoración media */}
                  <p style={{ marginTop: "5px", fontSize: "0.9em" }}>
                    Valoración media actual :{" "}
                    <strong>{evento.valoracionMedia?.toFixed(1) || 0}/10</strong> (
                    {evento.numeroValoraciones || 0} valoraciones)
                  </p>

                  {/* Comentarios */}
                  <p
                    onClick={() => toggleComentarios(evento.id)}
                    style={{ color: "gray", cursor: "pointer", marginTop: "5px" }}
                  >
                    &gt; Comentarios ({numComentarios[evento.id]})
                  </p>
                  {comentariosAbiertos[evento.id] && comentariosPorEvento[evento.id]?.length > 0 && (
                    <div
                    className="comentarios-lista"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "15px",
                      marginTop: "10px"
                    }}
                  >
                    {comentariosPorEvento[evento.id].map((coment, i) => (
                      <div
                        key={i}
                        style={{
                          backgroundColor: "#f5f5f5",
                          padding: "10px",
                          borderRadius: "8px",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                        }}
                      >
                        <p style={{ fontStyle: "italic", marginBottom: "5px" }}>"{coment.texto}"</p>
                        <p style={{ fontSize: "0.85em", color: "#555", margin: 0 }}>— {coment.usuario}</p>
                      </div>
                    ))}
                  </div>
                  )}
                </>
              ) : (
                <button onClick={() => handleDesapuntarse(evento.id)}>Desapuntarse</button>
              )}
            </div>
          ))
        ) : (
          <p>No estás inscrito en ningún evento.</p>
        )}
      </div>
    </div>

    {/* DERECHA - CREADOS */}
    <div className="columna">
      <h2>Eventos que he creado</h2>
      <div className="columna-eventos-grid">
        {eventosCreados.length > 0 ? (
          eventosCreados.map(evento => (
            <div key={evento.id} className="evento-card">
              <img src={evento.imagen} alt={evento.nombre} />
              <h3>{evento.nombre}</h3>
              <p>{evento.fecha}</p>
              <p>{evento.categoria}</p>
              <button onClick={() => navigate(`/modificar-evento/${evento.id}`)}>Modificar</button>
              <button onClick={() => handleEliminarEvento(evento.id)}>Eliminar</button>
              <button onClick={() => verInscritos(evento.id)}>Ver inscritos</button>
              {eventoAbierto === evento.id && (
                <div className="inscritos-lista">
                  <strong>Usuarios inscritos:</strong>
                  <ul>
                    {inscritosPorEvento[evento.id]?.length > 0 ? (
                      inscritosPorEvento[evento.id].map(usuario => (
                        <li key={usuario.id}>{usuario.nombreUsuario}</li>
                      ))
                    ) : (
                      <li>No hay inscritos</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No has creado eventos todavía.</p>
        )}
      </div>
    </div>
  </div>
);

}

export default MisEventos;
