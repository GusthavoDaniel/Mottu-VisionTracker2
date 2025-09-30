package com.mottu.visiontracker.dto;

import com.mottu.visiontracker.entity.Moto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

public class MotoDTO {

    private Long id;

    @NotBlank(message = "Placa é obrigatória")
    @Pattern(regexp = "^[A-Z]{3}[0-9]{4}$|^[A-Z]{3}[0-9][A-Z][0-9]{2}$", 
             message = "Formato de placa inválido. Use AAA0000 ou AAA0A00")
    private String placa;

    @NotBlank(message = "Modelo é obrigatório")
    @Size(min = 2, max = 50, message = "Modelo deve ter entre 2 e 50 caracteres")
    private String modelo;

    @NotBlank(message = "Cor é obrigatória")
    @Size(min = 2, max = 30, message = "Cor deve ter entre 2 e 30 caracteres")
    private String cor;

    @NotBlank(message = "Proprietário é obrigatório")
    @Size(min = 2, max = 100, message = "Proprietário deve ter entre 2 e 100 caracteres")
    private String proprietario;

    private String numeroSerie;
    private String tagRFID;
    private Moto.StatusMoto status;
    private String setor;
    private String posicao;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Construtores
    public MotoDTO() {}

    public MotoDTO(Moto moto) {
        this.id = moto.getId();
        this.placa = moto.getPlaca();
        this.modelo = moto.getModelo();
        this.cor = moto.getCor();
        this.proprietario = moto.getProprietario();
        this.numeroSerie = moto.getNumeroSerie();
        this.tagRFID = moto.getTagRFID();
        this.status = moto.getStatus();
        this.setor = moto.getSetor();
        this.posicao = moto.getPosicao();
        this.createdAt = moto.getCreatedAt();
        this.updatedAt = moto.getUpdatedAt();
    }

    // Método para converter DTO em entidade
    public Moto toEntity() {
        Moto moto = new Moto();
        moto.setId(this.id);
        moto.setPlaca(this.placa);
        moto.setModelo(this.modelo);
        moto.setCor(this.cor);
        moto.setProprietario(this.proprietario);
        moto.setNumeroSerie(this.numeroSerie);
        moto.setTagRFID(this.tagRFID);
        moto.setStatus(this.status != null ? this.status : Moto.StatusMoto.ATIVA);
        moto.setSetor(this.setor != null ? this.setor : "A1");
        moto.setPosicao(this.posicao != null ? this.posicao : "1");
        return moto;
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
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public String getCor() {
        return cor;
    }

    public void setCor(String cor) {
        this.cor = cor;
    }

    public String getProprietario() {
        return proprietario;
    }

    public void setProprietario(String proprietario) {
        this.proprietario = proprietario;
    }

    public String getNumeroSerie() {
        return numeroSerie;
    }

    public void setNumeroSerie(String numeroSerie) {
        this.numeroSerie = numeroSerie;
    }

    public String getTagRFID() {
        return tagRFID;
    }

    public void setTagRFID(String tagRFID) {
        this.tagRFID = tagRFID;
    }

    public Moto.StatusMoto getStatus() {
        return status;
    }

    public void setStatus(Moto.StatusMoto status) {
        this.status = status;
    }

    public String getSetor() {
        return setor;
    }

    public void setSetor(String setor) {
        this.setor = setor;
    }

    public String getPosicao() {
        return posicao;
    }

    public void setPosicao(String posicao) {
        this.posicao = posicao;
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
}
