package com.mottu.visiontracker.dto;

import com.mottu.visiontracker.entity.Alerta;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

public class AlertaDTO {

    private Long id;

    @NotNull(message = "ID da moto é obrigatório")
    private Long motoId;

    private MotoDTO moto;

    @NotNull(message = "Tipo do alerta é obrigatório")
    private Alerta.TipoAlerta tipo;

    @NotBlank(message = "Descrição é obrigatória")
    @Size(min = 5, max = 500, message = "Descrição deve ter entre 5 e 500 caracteres")
    private String descricao;

    private Boolean resolvido;
    private LocalDateTime timestamp;
    private LocalDateTime resolvedAt;

    // Construtores
    public AlertaDTO() {}

    public AlertaDTO(Alerta alerta) {
        this.id = alerta.getId();
        this.motoId = alerta.getMoto() != null ? alerta.getMoto().getId() : null;
        this.moto = alerta.getMoto() != null ? new MotoDTO(alerta.getMoto()) : null;
        this.tipo = alerta.getTipo();
        this.descricao = alerta.getDescricao();
        this.resolvido = alerta.getResolvido();
        this.timestamp = alerta.getTimestamp();
        this.resolvedAt = alerta.getResolvedAt();
    }

    // Método para converter DTO em entidade (sem a moto, que deve ser definida separadamente)
    public Alerta toEntity() {
        Alerta alerta = new Alerta();
        alerta.setId(this.id);
        alerta.setTipo(this.tipo);
        alerta.setDescricao(this.descricao);
        alerta.setResolvido(this.resolvido != null ? this.resolvido : false);
        if (this.timestamp != null) {
            alerta.setTimestamp(this.timestamp);
        }
        if (this.resolvedAt != null) {
            alerta.setResolvedAt(this.resolvedAt);
        }
        return alerta;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMotoId() {
        return motoId;
    }

    public void setMotoId(Long motoId) {
        this.motoId = motoId;
    }

    public MotoDTO getMoto() {
        return moto;
    }

    public void setMoto(MotoDTO moto) {
        this.moto = moto;
    }

    public Alerta.TipoAlerta getTipo() {
        return tipo;
    }

    public void setTipo(Alerta.TipoAlerta tipo) {
        this.tipo = tipo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Boolean getResolvido() {
        return resolvido;
    }

    public void setResolvido(Boolean resolvido) {
        this.resolvido = resolvido;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }
}
