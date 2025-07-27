package com.miweb.eventos.model;

import jakarta.persistence.*;

@Entity
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    @Column(length = 1000)
    private String descripcion;
    private String categoria;
    private String fecha;
    private double precio;
    private int capacidad;
    private String ubicacion;
    private String creador; 
    @Column(length = 500) 
    private String imagen;
    private double valoracionMedia;
    private int numeroValoraciones;
    


    // Getters y setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    public double getPrecio() {
        return precio;
    }

    public void setPrecio(double precio) {
        this.precio = precio;
    }

    public int getCapacidad() {
        return capacidad;
    }

    public void setCapacidad(int capacidad) {
        this.capacidad = capacidad;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public String getCreador() {
        return creador;
    }

    public void setCreador(String creador) {
        this.creador = creador;
    }

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
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
