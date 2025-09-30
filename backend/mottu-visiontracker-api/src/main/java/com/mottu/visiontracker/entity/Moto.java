package com.mottu.visiontracker.entity;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "motos")
public class Moto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Placa é obrigatória")
    @Pattern(regexp = "^[A-Z]{3}[0-9]{4}$|^[A-Z]{3}[0-9][A-Z][0-9]{2}$", 
             message = "Formato de placa inválido. Use AAA0000 ou AAA0A00")
    @Column(nullable = false, unique = true, length = 8)
    private String placa;

    @NotBlank(message = "Modelo é obrigatório")
    @Size(min = 2, max = 50, message = "Modelo deve ter entre 2 e 50 caracteres")
    @Column(nullable = false, length = 50)
    private String modelo;

    @NotBlank(message = "Cor é obrigatória")
    @Size(min = 2, max = 30, message = "Cor deve ter entre 2 e 30 caracteres")
    @Column(nullable = false, length = 30)
    private String cor;

    @NotBlank(message = "Proprietário é obrigatório")
    @Size(min = 2, max = 100, message = "Proprietário deve ter entre 2 e 100 caracteres")
    @Column(nullable = false, length = 100)
    private String proprietario;

    @Column(name = "numero_serie", length = 50)
    private String numeroSerie;

    @Column(name = "tag_rfid", length = 50)
    private String tagRFID;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusMoto status = StatusMoto.ATIVA;

    @Column(name = "setor", length = 10)
    private String setor = "A1";

    @Column(name = "posicao", length = 10)
    private String posicao = "1";

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;



    // Enum para Status
    public enum StatusMoto {
        ATIVA, MANUTENCAO, INATIVA
    }

    // Construtores
    public Moto() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Moto(String placa, String modelo, String cor, String proprietario) {
        this();
        this.placa = placa;
        this.modelo = modelo;
        this.cor = cor;
        this.proprietario = proprietario;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPlaca() {
        return placa;
    }

    public void setPlaca(String placa) {
        this.placa = placa;
        this.updatedAt = LocalDateTime.now();
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
        this.updatedAt = LocalDateTime.now();
    }

    public String getCor() {
        return cor;
    }

    public void setCor(String cor) {
        this.cor = cor;
        this.updatedAt = LocalDateTime.now();
    }

    public String getProprietario() {
        return proprietario;
    }

    public void setProprietario(String proprietario) {
        this.proprietario = proprietario;
        this.updatedAt = LocalDateTime.now();
    }

    public String getNumeroSerie() {
        return numeroSerie;
    }

    public void setNumeroSerie(String numeroSerie) {
        this.numeroSerie = numeroSerie;
        this.updatedAt = LocalDateTime.now();
    }

    public String getTagRFID() {
        return tagRFID;
    }

    public void setTagRFID(String tagRFID) {
        this.tagRFID = tagRFID;
        this.updatedAt = LocalDateTime.now();
    }

    public StatusMoto getStatus() {
        return status;
    }

    public void setStatus(StatusMoto status) {
        this.status = status;
        this.updatedAt = LocalDateTime.now();
    }

    public String getSetor() {
        return setor;
    }

    public void setSetor(String setor) {
        this.setor = setor;
        this.updatedAt = LocalDateTime.now();
    }

    public String getPosicao() {
        return posicao;
    }

    public void setPosicao(String posicao) {
        this.posicao = posicao;
        this.updatedAt = LocalDateTime.now();
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }



    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
