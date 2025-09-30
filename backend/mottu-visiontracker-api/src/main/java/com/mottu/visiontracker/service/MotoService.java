package com.mottu.visiontracker.service;

import com.mottu.visiontracker.dto.MotoDTO;
import com.mottu.visiontracker.entity.Moto;
import com.mottu.visiontracker.repository.MotoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class MotoService {

    @Autowired
    private MotoRepository motoRepository;

    /**
     * Lista todas as motos
     */
    public List<MotoDTO> findAll() {
        return motoRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(MotoDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Busca uma moto por ID
     */
    public Optional<MotoDTO> findById(Long id) {
        return motoRepository.findById(id)
                .map(MotoDTO::new);
    }

    /**
     * Busca uma moto por placa
     */
    public Optional<MotoDTO> findByPlaca(String placa) {
        return motoRepository.findByPlaca(placa.toUpperCase())
                .map(MotoDTO::new);
    }

    /**
     * Busca motos por status
     */
    public List<MotoDTO> findByStatus(Moto.StatusMoto status) {
        return motoRepository.findByStatus(status)
                .stream()
                .map(MotoDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Busca motos por múltiplos critérios
     */
    public List<MotoDTO> findByMultipleCriteria(String placa, String modelo, String proprietario, Moto.StatusMoto status) {
        return motoRepository.findByMultipleCriteria(placa, modelo, proprietario, status)
                .stream()
                .map(MotoDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Cria uma nova moto
     */
    public MotoDTO create(MotoDTO motoDTO) {
        // Validar se a placa já existe
        if (motoRepository.existsByPlaca(motoDTO.getPlaca().toUpperCase())) {
            throw new IllegalArgumentException("Já existe uma moto cadastrada com a placa: " + motoDTO.getPlaca());
        }

        Moto moto = motoDTO.toEntity();
        moto.setPlaca(moto.getPlaca().toUpperCase());
        
        // Gerar número de série e tag RFID se não fornecidos
        if (moto.getNumeroSerie() == null || moto.getNumeroSerie().isEmpty()) {
            moto.setNumeroSerie("SN" + System.currentTimeMillis());
        }
        if (moto.getTagRFID() == null || moto.getTagRFID().isEmpty()) {
            moto.setTagRFID("RF" + System.currentTimeMillis());
        }

        // Definir posição aleatória se não fornecida
        if (moto.getPosicao() == null || moto.getPosicao().isEmpty()) {
            moto.setPosicao(String.valueOf((int) (Math.random() * 10) + 1));
        }

        Moto savedMoto = motoRepository.save(moto);
        return new MotoDTO(savedMoto);
    }

    /**
     * Atualiza uma moto existente
     */
    public MotoDTO update(Long id, MotoDTO motoDTO) {
        Moto existingMoto = motoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Moto não encontrada com ID: " + id));

        // Verificar se a nova placa já existe em outra moto
        if (!existingMoto.getPlaca().equalsIgnoreCase(motoDTO.getPlaca())) {
            if (motoRepository.existsByPlaca(motoDTO.getPlaca().toUpperCase())) {
                throw new IllegalArgumentException("Já existe uma moto cadastrada com a placa: " + motoDTO.getPlaca());
            }
        }

        // Atualizar campos
        existingMoto.setPlaca(motoDTO.getPlaca().toUpperCase());
        existingMoto.setModelo(motoDTO.getModelo());
        existingMoto.setCor(motoDTO.getCor());
        existingMoto.setProprietario(motoDTO.getProprietario());
        
        if (motoDTO.getNumeroSerie() != null) {
            existingMoto.setNumeroSerie(motoDTO.getNumeroSerie());
        }
        if (motoDTO.getTagRFID() != null) {
            existingMoto.setTagRFID(motoDTO.getTagRFID());
        }
        if (motoDTO.getStatus() != null) {
            existingMoto.setStatus(motoDTO.getStatus());
        }
        if (motoDTO.getSetor() != null) {
            existingMoto.setSetor(motoDTO.getSetor());
        }
        if (motoDTO.getPosicao() != null) {
            existingMoto.setPosicao(motoDTO.getPosicao());
        }

        existingMoto.setUpdatedAt(LocalDateTime.now());

        Moto updatedMoto = motoRepository.save(existingMoto);
        return new MotoDTO(updatedMoto);
    }

    /**
     * Atualiza a posição de uma moto
     */
    public MotoDTO updatePosition(Long id, String setor, String posicao) {
        Moto moto = motoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Moto não encontrada com ID: " + id));

        moto.setSetor(setor);
        moto.setPosicao(posicao);
        moto.setUpdatedAt(LocalDateTime.now());

        Moto updatedMoto = motoRepository.save(moto);
        return new MotoDTO(updatedMoto);
    }

    /**
     * Atualiza o status de uma moto
     */
    public MotoDTO updateStatus(Long id, Moto.StatusMoto status) {
        Moto moto = motoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Moto não encontrada com ID: " + id));

        moto.setStatus(status);
        moto.setUpdatedAt(LocalDateTime.now());

        Moto updatedMoto = motoRepository.save(moto);
        return new MotoDTO(updatedMoto);
    }

    /**
     * Remove uma moto
     */
    public void delete(Long id) {
        if (!motoRepository.existsById(id)) {
            throw new IllegalArgumentException("Moto não encontrada com ID: " + id);
        }
        motoRepository.deleteById(id);
    }

    /**
     * Conta motos por status
     */
    public long countByStatus(Moto.StatusMoto status) {
        return motoRepository.countByStatus(status);
    }

    /**
     * Obtém estatísticas das motos
     */
    public MotoStats getStats() {
        long total = motoRepository.count();
        long ativas = motoRepository.countByStatus(Moto.StatusMoto.ATIVA);
        long manutencao = motoRepository.countByStatus(Moto.StatusMoto.MANUTENCAO);
        long inativas = motoRepository.countByStatus(Moto.StatusMoto.INATIVA);

        return new MotoStats(total, ativas, manutencao, inativas);
    }

    // Classe interna para estatísticas
    public static class MotoStats {
        private long total;
        private long ativas;
        private long manutencao;
        private long inativas;

        public MotoStats(long total, long ativas, long manutencao, long inativas) {
            this.total = total;
            this.ativas = ativas;
            this.manutencao = manutencao;
            this.inativas = inativas;
        }

        // Getters
        public long getTotal() { return total; }
        public long getAtivas() { return ativas; }
        public long getManutencao() { return manutencao; }
        public long getInativas() { return inativas; }
    }
}
