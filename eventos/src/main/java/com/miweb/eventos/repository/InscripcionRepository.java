package com.miweb.eventos.repository;

import com.miweb.eventos.model.Inscripcion;
import com.miweb.eventos.model.Inscripcion.InscripcionId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InscripcionRepository extends JpaRepository<Inscripcion, InscripcionId> {

    List<Inscripcion> findByUsuarioId(Long usuarioId);

    List<Inscripcion> findByEventoId(Long eventoId);

    Optional<Inscripcion> findByUsuarioIdAndEventoId(Long usuarioId, Long eventoId);

    boolean existsByUsuarioIdAndEventoId(Long usuarioId, Long eventoId);

    List<Inscripcion> findByEventoIdAndComentarioIsNotNull(Long eventoId);



}
