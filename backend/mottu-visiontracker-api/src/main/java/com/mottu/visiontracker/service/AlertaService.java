package com.mottu.visiontracker.service;

import com.mottu.visiontracker.dto.AlertaDTO;
import com.mottu.visiontracker.entity.Alerta;
import com.mottu.visiontracker.entity.Moto;
import com.mottu.visiontracker.repository.AlertaRepository;
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
public class AlertaService {

    @Autowired
    private AlertaRepository alertaRepository;

    @Autowired
    private MotoRepository motoRepository;

    /**
     * Lista todos os alertas
     */
    public List<AlertaDTO> findAll() {
        return alertaRepository.findAllByOrderByTimestampDesc()
                .stream()
                .map(AlertaDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Busca um alerta por ID
     */
    public Optional<AlertaDTO> findById(Long id) {
        return alertaRepository.findById(id)
                .map(AlertaDTO::new);
    }

    /**
     * Busca alertas não resolvidos
     */
    public List<AlertaDTO> findUnresolved() {
        return alertaRepository.findByResolvidoFalseOrderByTimestampDesc()
                .stream()
                .map(AlertaDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Busca alertas resolvidos
     */
    public List<AlertaDTO> findResolved() {
        return alertaRepository.findByResolvidoTrue()
                .stream()
                .map(AlertaDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Busca alertas por moto
     */
    public List<AlertaDTO> findByMotoId(Long motoId) {
        return alertaRepository.findByMotoIdAndResolvidoFalse(motoId)
                .stream()
                .map(AlertaDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Busca alertas críticos não resolvidos
     */
    public List<AlertaDTO> findCriticalUnresolved() {
        return alertaRepository.findCriticalUnresolvedAlerts()
                .stream()
                .map(AlertaDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Busca alertas por tipo
     */
    public List<AlertaDTO> findByTipo(Alerta.TipoAlerta tipo) {
        return alertaRepository.findByTipo(tipo)
                .stream()
                .map(AlertaDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Busca alertas por período
     */
    public List<AlertaDTO> findByPeriod(LocalDateTime inicio, LocalDateTime fim) {
        return alertaRepository.findByTimestampBetween(inicio, fim)
                .stream()
                .map(AlertaDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Cria um novo alerta
     */
    public AlertaDTO create(AlertaDTO alertaDTO) {
        // Verificar se a moto existe
        Moto moto = motoRepository.findById(alertaDTO.getMotoId())
                .orElseThrow(() -> new IllegalArgumentException("Moto não encontrada com ID: " + alertaDTO.getMotoId()));

        Alerta alerta = alertaDTO.toEntity();
        alerta.setMoto(moto);

        Alerta savedAlerta = alertaRepository.save(alerta);
        return new AlertaDTO(savedAlerta);
    }

    /**
     * Resolve um alerta
     */
    public AlertaDTO resolve(Long id) {
        Alerta alerta = alertaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Alerta não encontrado com ID: " + id));

        if (alerta.getResolvido()) {
            throw new IllegalStateException("Alerta já foi resolvido anteriormente");
        }

        alerta.setResolvido(true);
        alerta.setResolvedAt(LocalDateTime.now());

        Alerta resolvedAlerta = alertaRepository.save(alerta);
        return new AlertaDTO(resolvedAlerta);
    }

    /**
     * Atualiza um alerta
     */
    public AlertaDTO update(Long id, AlertaDTO alertaDTO) {
        Alerta existingAlerta = alertaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Alerta não encontrado com ID: " + id));

        // Verificar se a moto existe (se foi alterada)
        if (!existingAlerta.getMoto().getId().equals(alertaDTO.getMotoId())) {
            Moto moto = motoRepository.findById(alertaDTO.getMotoId())
                    .orElseThrow(() -> new IllegalArgumentException("Moto não encontrada com ID: " + alertaDTO.getMotoId()));
            existingAlerta.setMoto(moto);
        }

        // Atualizar campos
        existingAlerta.setTipo(alertaDTO.getTipo());
        existingAlerta.setDescricao(alertaDTO.getDescricao());
        
        if (alertaDTO.getResolvido() != null) {
            existingAlerta.setResolvido(alertaDTO.getResolvido());
            if (alertaDTO.getResolvido() && existingAlerta.getResolvedAt() == null) {
                existingAlerta.setResolvedAt(LocalDateTime.now());
            }
        }

        Alerta updatedAlerta = alertaRepository.save(existingAlerta);
        return new AlertaDTO(updatedAlerta);
    }

    /**
     * Remove um alerta
     */
    public void delete(Long id) {
        if (!alertaRepository.existsById(id)) {
            throw new IllegalArgumentException("Alerta não encontrado com ID: " + id);
        }
        alertaRepository.deleteById(id);
    }

    /**
     * Conta alertas não resolvidos
     */
    public long countUnresolved() {
        return alertaRepository.countByResolvidoFalse();
    }

    /**
     * Conta alertas não resolvidos por tipo
     */
    public long countUnresolvedByType(Alerta.TipoAlerta tipo) {
        return alertaRepository.countByResolvidoFalseAndTipo(tipo);
    }

    /**
     * Obtém estatísticas dos alertas
     */
    public AlertaStats getStats() {
        long total = alertaRepository.count();
        long naoResolvidos = alertaRepository.countByResolvidoFalse();
        long resolvidos = total - naoResolvidos;
        
        long movimentoNaoAutorizado = alertaRepository.countByResolvidoFalseAndTipo(Alerta.TipoAlerta.MOVIMENTO_NAO_AUTORIZADO);
        long manutencaoNecessaria = alertaRepository.countByResolvidoFalseAndTipo(Alerta.TipoAlerta.MANUTENCAO_NECESSARIA);
        long bateriaBaixa = alertaRepository.countByResolvidoFalseAndTipo(Alerta.TipoAlerta.BATERIA_BAIXA);
        long foraDaArea = alertaRepository.countByResolvidoFalseAndTipo(Alerta.TipoAlerta.FORA_DA_AREA);
        long semLeitura = alertaRepository.countByResolvidoFalseAndTipo(Alerta.TipoAlerta.SEM_LEITURA);

        return new AlertaStats(total, naoResolvidos, resolvidos, movimentoNaoAutorizado, 
                              manutencaoNecessaria, bateriaBaixa, foraDaArea, semLeitura);
    }

    /**
     * Gera alertas simulados para demonstração
     */
    public void generateSampleAlerts() {
        List<Moto> motos = motoRepository.findAll();
        if (motos.isEmpty()) {
            return;
        }

        // Gerar alguns alertas de exemplo
        for (int i = 0; i < Math.min(5, motos.size()); i++) {
            Moto moto = motos.get(i);
            
            Alerta alerta = new Alerta();
            alerta.setMoto(moto);
            alerta.setTipo(Alerta.TipoAlerta.values()[i % Alerta.TipoAlerta.values().length]);
            alerta.setDescricao("Alerta simulado para demonstração - " + alerta.getTipo().getDescricao());
            alerta.setResolvido(i % 3 == 0); // Alguns resolvidos, outros não
            
            if (alerta.getResolvido()) {
                alerta.setResolvedAt(LocalDateTime.now().minusHours(i));
            }

            alertaRepository.save(alerta);
        }
    }

    // Classe interna para estatísticas
    public static class AlertaStats {
        private long total;
        private long naoResolvidos;
        private long resolvidos;
        private long movimentoNaoAutorizado;
        private long manutencaoNecessaria;
        private long bateriaBaixa;
        private long foraDaArea;
        private long semLeitura;

        public AlertaStats(long total, long naoResolvidos, long resolvidos, 
                          long movimentoNaoAutorizado, long manutencaoNecessaria, 
                          long bateriaBaixa, long foraDaArea, long semLeitura) {
            this.total = total;
            this.naoResolvidos = naoResolvidos;
            this.resolvidos = resolvidos;
            this.movimentoNaoAutorizado = movimentoNaoAutorizado;
            this.manutencaoNecessaria = manutencaoNecessaria;
            this.bateriaBaixa = bateriaBaixa;
            this.foraDaArea = foraDaArea;
            this.semLeitura = semLeitura;
        }

        // Getters
        public long getTotal() { return total; }
        public long getNaoResolvidos() { return naoResolvidos; }
        public long getResolvidos() { return resolvidos; }
        public long getMovimentoNaoAutorizado() { return movimentoNaoAutorizado; }
        public long getManutencaoNecessaria() { return manutencaoNecessaria; }
        public long getBateriaBaixa() { return bateriaBaixa; }
        public long getForaDaArea() { return foraDaArea; }
        public long getSemLeitura() { return semLeitura; }
    }
}
