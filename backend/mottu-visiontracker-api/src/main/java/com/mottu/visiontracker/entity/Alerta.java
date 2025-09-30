package com.mottu.visiontracker.entity;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "alertas")
public class Alerta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "moto_id", nullable = false)
    private Moto moto;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoAlerta tipo;

    @NotBlank(message = "Descrição é obrigatória")
    @Size(min = 5, max = 500, message = "Descrição deve ter entre 5 e 500 caracteres")
    @Column(nullable = false, length = 500)
    private String descricao;

    @Column(nullable = false)
    private Boolean resolvido = false;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    // Enum para Tipo de Alerta
    public enum TipoAlerta {
        MOVIMENTO_NAO_AUTORIZADO("Movimento não autorizado"),
        MANUTENCAO_NECESSARIA("Manutenção necessária"),
        BATERIA_BAIXA("Bateria baixa"),
        FORA_DA_AREA("Fora da área"),
        SEM_LEITURA("Sem leitura RFID");

        private final String descricao;

        TipoAlerta(String descricao) {
            this.descricao = descricao;
        }

        public String getDescricao() {
            return descricao;
        }
    }

    // Construtores
    public Alerta() {
        this.timestamp = LocalDateTime.now();
    }

    public Alerta(Moto moto, TipoAlerta tipo, String descricao) {
        this();
        this.moto = moto;
        this.tipo = tipo;
        this.descricao = descricao;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Moto getMoto() {
        return moto;
    }

    public void setMoto(Moto moto) {
        this.moto = moto;
    }

    public TipoAlerta getTipo() {
        return tipo;
    }

    public void setTipo(TipoAlerta tipo) {
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
        if (resolvido && this.resolvedAt == null) {
            this.resolvedAt = LocalDateTime.now();
        }
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
