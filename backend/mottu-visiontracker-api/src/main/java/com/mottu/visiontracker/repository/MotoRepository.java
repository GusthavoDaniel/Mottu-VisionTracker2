package com.mottu.visiontracker.repository;

import com.mottu.visiontracker.entity.Moto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MotoRepository extends JpaRepository<Moto, Long> {

    /**
     * Busca uma moto pela placa
     */
    Optional<Moto> findByPlaca(String placa);

    /**
     * Verifica se existe uma moto com a placa especificada
     */
    boolean existsByPlaca(String placa);

    /**
     * Busca motos por status
     */
    List<Moto> findByStatus(Moto.StatusMoto status);

    /**
     * Busca motos por modelo (busca parcial, case-insensitive)
     */
    @Query("SELECT m FROM Moto m WHERE LOWER(m.modelo) LIKE LOWER(CONCAT('%', :modelo, '%'))")
    List<Moto> findByModeloContainingIgnoreCase(@Param("modelo") String modelo);

    /**
     * Busca motos por proprietário (busca parcial, case-insensitive)
     */
    @Query("SELECT m FROM Moto m WHERE LOWER(m.proprietario) LIKE LOWER(CONCAT('%', :proprietario, '%'))")
    List<Moto> findByProprietarioContainingIgnoreCase(@Param("proprietario") String proprietario);

    /**
     * Busca motos por setor
     */
    List<Moto> findBySetor(String setor);

    /**
     * Busca motos por setor e posição
     */
    List<Moto> findBySetorAndPosicao(String setor, String posicao);

    /**
     * Conta o número total de motos por status
     */
    @Query("SELECT COUNT(m) FROM Moto m WHERE m.status = :status")
    long countByStatus(@Param("status") Moto.StatusMoto status);

    /**
     * Busca todas as motos ordenadas por data de criação (mais recentes primeiro)
     */
    List<Moto> findAllByOrderByCreatedAtDesc();

    /**
     * Busca motos por múltiplos critérios (placa, modelo, proprietário)
     */
    @Query("SELECT m FROM Moto m WHERE " +
           "(:placa IS NULL OR LOWER(m.placa) LIKE LOWER(CONCAT('%', :placa, '%'))) AND " +
           "(:modelo IS NULL OR LOWER(m.modelo) LIKE LOWER(CONCAT('%', :modelo, '%'))) AND " +
           "(:proprietario IS NULL OR LOWER(m.proprietario) LIKE LOWER(CONCAT('%', :proprietario, '%'))) AND " +
           "(:status IS NULL OR m.status = :status)")
    List<Moto> findByMultipleCriteria(@Param("placa") String placa,
                                      @Param("modelo") String modelo,
                                      @Param("proprietario") String proprietario,
                                      @Param("status") Moto.StatusMoto status);
}
