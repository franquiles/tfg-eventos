package com.miweb.eventos.controller;

import com.miweb.eventos.model.Evento;
import com.miweb.eventos.model.Usuario;
import com.miweb.eventos.repository.EventoRepository;
import com.miweb.eventos.repository.UsuarioRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/eventos")
@CrossOrigin(origins = "*")
public class EventoController {

    private final EventoRepository eventoRepo;
    private final UsuarioRepository usuarioRepo;

    public EventoController(EventoRepository eventoRepo, UsuarioRepository usuarioRepo) {
        this.eventoRepo = eventoRepo;
        this.usuarioRepo = usuarioRepo;
    }

    @PostMapping("/crear")
    public String crearEvento(@RequestBody Evento evento) {
        eventoRepo.save(evento);
        return "Evento creado correctamente";
    }

    @GetMapping("/listar")
    public List<Evento> obtenerEventos() {
        return eventoRepo.findAll();
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<Evento> obtenerEventoPorId(@PathVariable Long id) {
        return eventoRepo.findById(id)
               .map(ResponseEntity::ok)
               .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/creados")
    public List<Evento> eventosCreadosPorUsuario(@RequestParam String usuario) {
        return eventoRepo.findByCreador(usuario);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarEvento(@PathVariable Long id) {
        if (eventoRepo.existsById(id)) {
            eventoRepo.deleteById(id);
            return ResponseEntity.ok("Evento eliminado");
        } else {
            return ResponseEntity.status(404).body("Evento no encontrado");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> modificarEvento(@PathVariable Long id, @RequestBody Evento actualizado) {
        return eventoRepo.findById(id)
            .map(evento -> {
                evento.setNombre(actualizado.getNombre());
                evento.setDescripcion(actualizado.getDescripcion());
                evento.setCategoria(actualizado.getCategoria());
                evento.setFecha(actualizado.getFecha());
                evento.setPrecio(actualizado.getPrecio());
                evento.setCapacidad(actualizado.getCapacidad());
                evento.setUbicacion(actualizado.getUbicacion());
                evento.setImagen(actualizado.getImagen());
                eventoRepo.save(evento);
                return ResponseEntity.ok("Evento actualizado");
            })
            .orElse(ResponseEntity.status(404).body("Evento no encontrado"));
    }

    @GetMapping("/busqueda")
    public List<Evento> buscarEventos(
        @RequestParam(required = false) String ciudad,
        @RequestParam(required = false) String categoria,
        @RequestParam(required = false) String precio,
        @RequestParam(required = false) String fecha
    ) {
        LocalDate hoy = LocalDate.now();
        List<Evento> eventos = eventoRepo.findAll();

        return eventos.stream()
            .filter(e -> ciudad == null || e.getUbicacion().toLowerCase().contains(ciudad.toLowerCase()))
            .filter(e -> categoria == null || e.getCategoria().equalsIgnoreCase(categoria))
            .filter(e -> {
                if (precio == null) return true;
                double p = e.getPrecio();
                return switch (precio.toLowerCase()) {
                    case "gratis" -> p == 0;
                    case "1-10" -> p > 0 && p <= 10;
                    case "10-25" -> p > 10 && p <= 25;
                    case "25-50" -> p > 25 && p <= 50;
                    case "50-100" -> p > 50 && p <= 100;
                    case "100+" -> p > 100;
                    default -> true;
                };
            })
            .filter(e -> {
                if (fecha == null) return true;
                LocalDate fechaEvento = LocalDate.parse(e.getFecha());
                return switch (fecha.toLowerCase()) {
                    case "hoy" -> fechaEvento.isEqual(hoy);
                    case "mañana" -> fechaEvento.isEqual(hoy.plusDays(1));
                    case "esta semana" -> fechaEvento.isAfter(hoy.minusDays(1)) && fechaEvento.isBefore(hoy.plusDays(7));
                    case "este mes" -> fechaEvento.getMonth().equals(hoy.getMonth());
                    case "dentro de un mes" -> fechaEvento.isAfter(hoy.plusDays(30));
                    default -> true;
                };
            })
            .toList();
    }

}
