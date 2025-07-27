package com.miweb.eventos.model;

import jakarta.persistence.*;

@Entity
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String correo;
    private String nombreUsuario;
    private String contraseña;
    private double valoracionMedia;
    private int numeroValoraciones;

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

	public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public String getContraseña() {
        return contraseña;
    }

    public void setContraseña(String contraseña) {
        this.contraseña = contraseña;
    }

    public double getValoracionMedia() { 
        return valoracionMedia; 
    }
    public void setValoracionMedia(double valoracionMedia) { 
        this.valoracionMedia = valoracionMedia; 
    }

    public int getNumeroValoraciones() { 
        return numeroValoraciones; 
    }
    public void setNumeroValoraciones(int numeroValoraciones) { 
        this.numeroValoraciones = numeroValoraciones; 
    }
}
