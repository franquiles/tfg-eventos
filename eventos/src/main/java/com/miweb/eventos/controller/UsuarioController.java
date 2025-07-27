package com.miweb.eventos.controller;

import com.miweb.eventos.model.Usuario;
import com.miweb.eventos.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioRepository repo;

    public UsuarioController(UsuarioRepository repo) {
        this.repo = repo;
    }

    @PostMapping("/registro")
    public String registrar(@RequestBody Usuario usuario) {
        if (repo.existsByCorreo(usuario.getCorreo())) {
            return "Correo ya registrado";
        }
        repo.save(usuario);
        return "Usuario registrado correctamente";
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> datos) {
        String correo = datos.get("correo");
        String contraseña = datos.get("contraseña");

        Optional<Usuario> usuario = repo.findByCorreoAndContraseña(correo, contraseña);

            if (usuario.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("id", usuario.get().getId());
                response.put("nombreUsuario", usuario.get().getNombreUsuario());
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(401).body("Credenciales incorrectas");
            }
    }

@GetMapping("/por-nombre/{nombre}")
public ResponseEntity<Usuario> obtenerPorNombre(@PathVariable String nombre) {
    return repo.findByNombreUsuario(nombre)
               .map(ResponseEntity::ok)
               .orElse(ResponseEntity.notFound().build());
}





}
