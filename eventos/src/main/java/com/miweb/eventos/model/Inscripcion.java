package com.miweb.eventos.model;

import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDate;

@Entity
@IdClass(Inscripcion.InscripcionId.class)
public class Inscripcion {

    @Id
    private Long usuarioId;

    @Id
    private Long eventoId;

    private LocalDate fecha;
    private Integer valoracion;

    @Column(columnDefinition = "TEXT")
    private String comentario;



    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public Long getEventoId() {
        return eventoId;
    }

    public void setEventoId(Long eventoId) {
        this.eventoId = eventoId;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public Integer getValoracion() {
    return valoracion;
    }

    public void setValoracion(Integer valoracion) {
        this.valoracion = valoracion;
    }

    public String getComentario() {
    return comentario;
}

public void setComentario(String comentario) {
    this.comentario = comentario;
}




    // Clase interna para representar la clave compuesta
    public static class InscripcionId implements Serializable {
        private Long usuarioId;
        private Long eventoId;

        public InscripcionId() {}

        public InscripcionId(Long usuarioId, Long eventoId) {
            this.usuarioId = usuarioId;
            this.eventoId = eventoId;
        }

        // Métodos equals y hashCode necesarios para la clave compuesta

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof InscripcionId)) return false;
            InscripcionId that = (InscripcionId) o;
            return usuarioId.equals(that.usuarioId) && eventoId.equals(that.eventoId);
        }

        @Override
        public int hashCode() {
            return usuarioId.hashCode() + eventoId.hashCode();
        }
    }
}
