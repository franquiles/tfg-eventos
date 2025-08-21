package com.miweb.eventos.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarCodigo(String destino, String codigo) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setTo(destino);
        mensaje.setSubject("Código de recuperación");
        mensaje.setText("Tu código de recuperación es: " + codigo);
        mensaje.setFrom("eventostfg@gmail.com"); // Debe ser el mismo correo

        mailSender.send(mensaje);
    }
}
