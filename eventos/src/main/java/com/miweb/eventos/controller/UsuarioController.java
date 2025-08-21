package com.miweb.eventos.controller;

import com.miweb.eventos.model.Usuario;
import com.miweb.eventos.repository.UsuarioRepository;
import com.miweb.eventos.service.EmailService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.miweb.eventos.service.EmailService;


import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioRepository repo;
    private final EmailService emailService;
    private Map<String, String> codigosRecuperacion = new HashMap<>();

    public UsuarioController(UsuarioRepository repo, EmailService emailService) {
    this.repo = repo;
    this.emailService = emailService;
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


@GetMapping("/test")
public String testBackend() {
    return "Backend activo";
}



@PostMapping("/recuperar")
public ResponseEntity<String> enviarCodigo(@RequestBody Map<String, String> datos) {
    String correo = datos.get("correo");
    Optional<Usuario> usuario = repo.findByCorreo(correo);
    if (usuario.isEmpty()) return ResponseEntity.status(404).body("Correo no registrado");

    String codigo = String.format("%06d", new Random().nextInt(999999));
    codigosRecuperacion.put(correo, codigo);

    // ✅ Enviar correo real
    emailService.enviarCodigo(correo, codigo);

    return ResponseEntity.ok("Código enviado");
}


@PostMapping("/validar-codigo")
public ResponseEntity<String> validarCodigo(@RequestBody Map<String, String> datos) {
    String correo = datos.get("correo");
    String codigo = datos.get("codigo");

    String guardado = codigosRecuperacion.get(correo);
    if (guardado == null || !guardado.equals(codigo)) {
        return ResponseEntity.status(400).body("Código incorrecto");
    }
    return ResponseEntity.ok("Código válido");
}

@PostMapping("/cambiar-password")
public ResponseEntity<String> cambiarPassword(@RequestBody Map<String, String> datos) {
    String correo = datos.get("correo");
    String nueva = datos.get("nueva");

    Optional<Usuario> usuario = repo.findByCorreo(correo);
    if (usuario.isEmpty()) return ResponseEntity.status(404).body("Usuario no encontrado");

    Usuario u = usuario.get();
    u.setContraseña(nueva); // Aquí puedes usar BCrypt para cifrar
    repo.save(u);

    codigosRecuperacion.remove(correo); // eliminar el código usado

    return ResponseEntity.ok("Contraseña cambiada");
}









}
