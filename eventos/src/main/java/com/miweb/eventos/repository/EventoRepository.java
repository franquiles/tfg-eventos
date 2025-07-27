package com.miweb.eventos.repository;

import com.miweb.eventos.model.Evento;
import org.springframework.data.jpa.repository.JpaRepository;


import java.time.LocalDate;
import java.util.List;


public interface EventoRepository extends JpaRepository<Evento, Long> {
    List<Evento> findByCreador(String creador);



}

