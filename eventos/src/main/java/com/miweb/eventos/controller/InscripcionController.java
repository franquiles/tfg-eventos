package com.miweb.eventos.controller;

import com.miweb.eventos.model.Evento;
import com.miweb.eventos.model.Inscripcion;
import com.miweb.eventos.model.Usuario;
import com.miweb.eventos.repository.EventoRepository;
import com.miweb.eventos.repository.InscripcionRepository;
import com.miweb.eventos.repository.UsuarioRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/inscripciones")
@CrossOrigin(origins = "*")
public class InscripcionController {

    private final InscripcionRepository inscripcionRepo;
    private final EventoRepository eventoRepo;
    private final UsuarioRepository usuarioRepo;

    public InscripcionController(InscripcionRepository inscripcionRepo, EventoRepository eventoRepo, UsuarioRepository usuarioRepo) {
        this.inscripcionRepo = inscripcionRepo;
        this.eventoRepo = eventoRepo;
        this.usuarioRepo = usuarioRepo;
    }

    // Endpoint para inscribirse a un evento
    @PostMapping("/apuntarse")
    public String apuntarse(@RequestBody Inscripcion inscripcion) {
        // Verifica si ya está inscrito
        boolean yaInscrito = inscripcionRepo.existsByUsuarioIdAndEventoId(inscripcion.getUsuarioId(), inscripcion.getEventoId());
        if (yaInscrito) return "Ya estás inscrito en este evento.";

        // Busca el evento y verifica que haya capacidad
        Optional<Evento> eventoOpt = eventoRepo.findById(inscripcion.getEventoId());
        if (eventoOpt.isEmpty()) return "Evento no encontrado";

        Evento evento = eventoOpt.get();
        if (evento.getCapacidad() <= 0) return "No hay plazas disponibles";

        // Disminuye capacidad y guarda inscripción
        evento.setCapacidad(evento.getCapacidad() - 1);
        eventoRepo.save(evento);

        inscripcion.setFecha(LocalDate.now());
        inscripcionRepo.save(inscripcion);

        return "Inscripción realizada correctamente.";
    }

    // Obtener eventos en los que está inscrito un usuario
    @GetMapping("/usuario/{usuarioId}")
    public List<Inscripcion> obtenerInscripcionesPorUsuario(@PathVariable Long usuarioId) {
        return inscripcionRepo.findByUsuarioId(usuarioId);
    }

    // Obtener todos los usuarios inscritos a un evento
    @GetMapping("/evento/{eventoId}")
    public List<Inscripcion> obtenerInscripcionesPorEvento(@PathVariable Long eventoId) {
        return inscripcionRepo.findByEventoId(eventoId);
    }

    // Obtener inscripción específica
    @GetMapping("/comprobar")
    public boolean estaInscrito(@RequestParam Long usuarioId, @RequestParam Long eventoId) {
        return inscripcionRepo.existsByUsuarioIdAndEventoId(usuarioId, eventoId);
    }

    @GetMapping("/inscritos/{usuarioId}")
public List<Evento> obtenerEventosInscritos(@PathVariable Long usuarioId) {
    List<Inscripcion> inscripciones = inscripcionRepo.findByUsuarioId(usuarioId);
    return inscripciones.stream()
        .map(insc -> eventoRepo.findById(insc.getEventoId()))
        .filter(Optional::isPresent)
        .map(Optional::get)
        .toList();
}

@DeleteMapping("/desapuntarse")
public String desapuntarse(@RequestParam Long usuarioId, @RequestParam Long eventoId) {
    // Buscar inscripción
    Optional<Inscripcion> inscripcionOpt = inscripcionRepo.findByUsuarioIdAndEventoId(usuarioId, eventoId);
    if (inscripcionOpt.isEmpty()) {
        return "No estás inscrito en este evento.";
    }

    // Eliminar inscripción
    inscripcionRepo.delete(inscripcionOpt.get());

    // Sumar la capacidad de nuevo
    Optional<Evento> eventoOpt = eventoRepo.findById(eventoId);
    eventoOpt.ifPresent(evento -> {
        evento.setCapacidad(evento.getCapacidad() + 1);
        eventoRepo.save(evento);
    });

    return "Te has desapuntado del evento correctamente.";
}


@PutMapping("/valorar")
public ResponseEntity<String> valorarEvento(@RequestBody Map<String, String> payload) {
    Long usuarioId = Long.parseLong(payload.get("usuarioId"));
    Long eventoId = Long.parseLong(payload.get("eventoId"));
    int nota = Integer.parseInt(payload.get("valoracion"));

    Optional<Inscripcion> inscripcionOpt = inscripcionRepo.findByUsuarioIdAndEventoId(usuarioId, eventoId);
    if (inscripcionOpt.isEmpty()) return ResponseEntity.badRequest().body("Inscripción no encontrada");

    Inscripcion inscripcion = inscripcionOpt.get();
    if (inscripcion.getValoracion() != null)
        return ResponseEntity.badRequest().body("Ya has valorado este evento");

    inscripcion.setValoracion(nota);
    inscripcionRepo.save(inscripcion);

    // Actualizar media del evento
    Evento evento = eventoRepo.findById(eventoId).orElse(null);
    if (evento == null) return ResponseEntity.badRequest().body("Evento no encontrado");

    int total = evento.getNumeroValoraciones();
    double media = evento.getValoracionMedia();
    double nuevaMedia = ((media * total) + nota) / (total + 1);

    evento.setNumeroValoraciones(total + 1);
    evento.setValoracionMedia(nuevaMedia);
    eventoRepo.save(evento);

    // Actualizar media y número de valoraciones del creador
    Usuario creador = usuarioRepo.findByNombreUsuario(evento.getCreador()).orElse(null);
    if (creador != null) {
        List<Evento> eventosCreados = eventoRepo.findByCreador(creador.getNombreUsuario());
        int cantidad = 0;
        double suma = 0;
        for (Evento ev : eventosCreados) {
            if (ev.getNumeroValoraciones() > 0) {
                suma += ev.getValoracionMedia();
                cantidad++;
            }
        }
        if (cantidad > 0) {
            creador.setValoracionMedia(suma / cantidad);
            creador.setNumeroValoraciones(cantidad); 
            usuarioRepo.save(creador);
        }
    }

    return ResponseEntity.ok("Valoración registrada correctamente");
}

@GetMapping("/evento/{eventoId}/usuarios")
public List<Usuario> obtenerUsuariosInscritos(@PathVariable Long eventoId) {
    List<Inscripcion> inscripciones = inscripcionRepo.findByEventoId(eventoId);
    List<Long> idsUsuarios = inscripciones.stream()
        .map(Inscripcion::getUsuarioId)
        .collect(Collectors.toList());
    return usuarioRepo.findAllById(idsUsuarios);
}


@PutMapping("/comentar")
public ResponseEntity<String> comentarEvento(@RequestBody Map<String, String> payload) {
    Long usuarioId = Long.parseLong(payload.get("usuarioId"));
    Long eventoId = Long.parseLong(payload.get("eventoId"));
    String comentario = payload.get("comentario");

    Optional<Inscripcion> inscripcionOpt = inscripcionRepo.findByUsuarioIdAndEventoId(usuarioId, eventoId);
    if (inscripcionOpt.isPresent()) {
        Inscripcion inscripcion = inscripcionOpt.get();

        if (inscripcion.getComentario() != null && !inscripcion.getComentario().isBlank()) {
            return ResponseEntity.badRequest().body("Ya has comentado este evento");
        }

        inscripcion.setComentario(comentario);
        inscripcionRepo.save(inscripcion);
        return ResponseEntity.ok("Comentario guardado");
    } else {
        return ResponseEntity.status(404).body("Inscripción no encontrada");
    }
}


@GetMapping("/comentarios/{eventoId}")
public List<Map<String, String>> obtenerComentarios(@PathVariable Long eventoId) {
    List<Inscripcion> inscripciones = inscripcionRepo.findByEventoId(eventoId);
    return inscripciones.stream()
            .filter(i -> i.getComentario() != null && !i.getComentario().isBlank())
            .map(i -> {
                Map<String, String> comentario = new HashMap<>();
                Optional<Usuario> usuario = usuarioRepo.findById(i.getUsuarioId());
                comentario.put("usuario", usuario.map(Usuario::getNombreUsuario).orElse("Anónimo"));
                comentario.put("texto", i.getComentario());
                return comentario;
            })
            .toList();
}



}
