package com.mottu.visiontracker.repository;

import com.mottu.visiontracker.entity.Alerta;
import com.mottu.visiontracker.entity.Moto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AlertaRepository extends JpaRepository<Alerta, Long> {

    /**
     * Busca alertas por moto
     */
    List<Alerta> findByMoto(Moto moto);

    /**
     * Busca alertas por ID da moto
     */
    List<Alerta> findByMotoId(Long motoId);

    /**
     * Busca alertas por tipo
     */
    List<Alerta> findByTipo(Alerta.TipoAlerta tipo);

    /**
     * Busca alertas não resolvidos
     */
    List<Alerta> findByResolvidoFalse();

    /**
     * Busca alertas resolvidos
     */
    List<Alerta> findByResolvidoTrue();

    /**
     * Busca alertas não resolvidos por moto
     */
    List<Alerta> findByMotoAndResolvidoFalse(Moto moto);

    /**
     * Busca alertas não resolvidos por ID da moto
     */
    List<Alerta> findByMotoIdAndResolvidoFalse(Long motoId);

    /**
     * Busca alertas por período
     */
    @Query("SELECT a FROM Alerta a WHERE a.timestamp BETWEEN :inicio AND :fim")
    List<Alerta> findByTimestampBetween(@Param("inicio") LocalDateTime inicio, 
                                        @Param("fim") LocalDateTime fim);

    /**
     * Busca alertas não resolvidos por período
     */
    @Query("SELECT a FROM Alerta a WHERE a.timestamp BETWEEN :inicio AND :fim AND a.resolvido = false")
    List<Alerta> findByTimestampBetweenAndResolvidoFalse(@Param("inicio") LocalDateTime inicio, 
                                                         @Param("fim") LocalDateTime fim);

    /**
     * Conta alertas não resolvidos
     */
    @Query("SELECT COUNT(a) FROM Alerta a WHERE a.resolvido = false")
    long countByResolvidoFalse();

    /**
     * Conta alertas não resolvidos por tipo
     */
    @Query("SELECT COUNT(a) FROM Alerta a WHERE a.resolvido = false AND a.tipo = :tipo")
    long countByResolvidoFalseAndTipo(@Param("tipo") Alerta.TipoAlerta tipo);

    /**
     * Busca todos os alertas ordenados por timestamp (mais recentes primeiro)
     */
    List<Alerta> findAllByOrderByTimestampDesc();

    /**
     * Busca alertas não resolvidos ordenados por timestamp (mais recentes primeiro)
     */
    List<Alerta> findByResolvidoFalseOrderByTimestampDesc();

    /**
     * Busca alertas por moto ordenados por timestamp (mais recentes primeiro)
     */
    List<Alerta> findByMotoOrderByTimestampDesc(Moto moto);

    /**
     * Busca alertas críticos (movimento não autorizado e fora da área) não resolvidos
     */
    @Query("SELECT a FROM Alerta a WHERE a.resolvido = false AND " +
           "(a.tipo = 'MOVIMENTO_NAO_AUTORIZADO' OR a.tipo = 'FORA_DA_AREA') " +
           "ORDER BY a.timestamp DESC")
    List<Alerta> findCriticalUnresolvedAlerts();
}
