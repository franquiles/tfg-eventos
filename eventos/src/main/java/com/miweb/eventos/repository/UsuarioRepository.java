package com.miweb.eventos.repository;

import com.miweb.eventos.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    boolean existsByCorreo(String correo);

    Optional<Usuario> findByCorreoAndContraseña(String correo, String contraseña);
    Optional<Usuario> findByNombreUsuario(String nombreUsuario);

}

