package com.mottu.visiontracker.controller;

import com.mottu.visiontracker.dto.AlertaDTO;
import com.mottu.visiontracker.dto.ApiResponse;
import com.mottu.visiontracker.entity.Alerta;
import com.mottu.visiontracker.service.AlertaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/alertas")
@CrossOrigin(origins = "*")
public class AlertaController {

    @Autowired
    private AlertaService alertaService;

    /**
     * GET /api/alertas - Lista todos os alertas
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<AlertaDTO>>> getAllAlertas(
            @RequestParam(required = false) Boolean resolvido,
            @RequestParam(required = false) Alerta.TipoAlerta tipo,
            @RequestParam(required = false) Long motoId) {
        
        try {
            List<AlertaDTO> alertas;
            
            if (resolvido != null && !resolvido) {
                alertas = alertaService.findUnresolved();
            } else if (resolvido != null && resolvido) {
                alertas = alertaService.findResolved();
            } else if (tipo != null) {
                alertas = alertaService.findByTipo(tipo);
            } else if (motoId != null) {
                alertas = alertaService.findByMotoId(motoId);
            } else {
                alertas = alertaService.findAll();
            }
            
            return ResponseEntity.ok(ApiResponse.success("Alertas carregados com sucesso", alertas));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erro ao carregar alertas", e.getMessage()));
        }
    }

    /**
     * GET /api/alertas/{id} - Busca um alerta por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AlertaDTO>> getAlertaById(@PathVariable Long id) {
        try {
            Optional<AlertaDTO> alerta = alertaService.findById(id);
            
            if (alerta.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success("Alerta encontrado", alerta.get()));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Alerta não encontrado com ID: " + id));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erro ao buscar alerta", e.getMessage()));
        }
    }

    /**
     * GET /api/alertas/unresolved - Lista alertas não resolvidos
     */
    @GetMapping("/unresolved")
    public ResponseEntity<ApiResponse<List<AlertaDTO>>> getUnresolvedAlertas() {
        try {
            List<AlertaDTO> alertas = alertaService.findUnresolved();
            return ResponseEntity.ok(ApiResponse.success("Alertas não resolvidos carregados", alertas));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erro ao carregar alertas", e.getMessage()));
        }
    }

    /**
     * GET /api/alertas/critical - Lista alertas críticos não resolvidos
     */
    @GetMapping("/critical")
    public ResponseEntity<ApiResponse<List<AlertaDTO>>> getCriticalAlertas() {
        try {
            List<AlertaDTO> alertas = alertaService.findCriticalUnresolved();
            return ResponseEntity.ok(ApiResponse.success("Alertas críticos carregados", alertas));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erro ao carregar alertas críticos", e.getMessage()));
        }
    }

    /**
     * GET /api/alertas/moto/{motoId} - Lista alertas de uma moto específica
     */
    @GetMapping("/moto/{motoId}")
    public ResponseEntity<ApiResponse<List<AlertaDTO>>> getAlertasByMoto(@PathVariable Long motoId) {
        try {
            List<AlertaDTO> alertas = alertaService.findByMotoId(motoId);
            return ResponseEntity.ok(ApiResponse.success("Alertas da moto carregados", alertas));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erro ao carregar alertas da moto", e.getMessage()));
        }
    }

    /**
     * GET /api/alertas/periodo - Lista alertas por período
     */
    @GetMapping("/periodo")
    public ResponseEntity<ApiResponse<List<AlertaDTO>>> getAlertasByPeriod(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim) {
        
        try {
            List<AlertaDTO> alertas = alertaService.findByPeriod(inicio, fim);
            return ResponseEntity.ok(ApiResponse.success("Alertas do período carregados", alertas));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erro ao carregar alertas do período", e.getMessage()));
        }
    }

    /**
     * POST /api/alertas - Cria um novo alerta
     */
    @PostMapping
    public ResponseEntity<ApiResponse<AlertaDTO>> createAlerta(@Valid @RequestBody AlertaDTO alertaDTO, BindingResult result) {
        if (result.hasErrors()) {
            StringBuilder errors = new StringBuilder();
            result.getAllErrors().forEach(error -> errors.append(error.getDefaultMessage()).append("; "));
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Dados inválidos", errors.toString()));
        }

        try {
            AlertaDTO createdAlerta = alertaService.create(alertaDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Alerta criado com sucesso", createdAlerta));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Erro de validação", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erro ao criar alerta", e.getMessage()));
        }
    }

    /**
     * PUT /api/alertas/{id} - Atualiza um alerta existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AlertaDTO>> updateAlerta(@PathVariable Long id, 
                                                               @Valid @RequestBody AlertaDTO alertaDTO, 
                                                               BindingResult result) {
        if (result.hasErrors()) {
            StringBuilder errors = new StringBuilder();
            result.getAllErrors().forEach(error -> errors.append(error.getDefaultMessage()).append("; "));
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Dados inválidos", errors.toString()));
        }

        try {
            AlertaDTO updatedAlerta = alertaService.update(id, alertaDTO);
            return ResponseEntity.ok(ApiResponse.success("Alerta atualizado com sucesso", updatedAlerta));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Erro de validação", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erro ao atualizar alerta", e.getMessage()));
        }
    }

    /**
     * PATCH /api/alertas/{id}/resolve - Resolve um alerta
     */
    @PatchMapping("/{id}/resolve")
    public ResponseEntity<ApiResponse<AlertaDTO>> resolveAlerta(@PathVariable Long id) {
        try {
            AlertaDTO resolvedAlerta = alertaService.resolve(id);
            return ResponseEntity.ok(ApiResponse.success("Alerta resolvido com sucesso", resolvedAlerta));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Alerta não encontrado", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Estado inválido", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erro ao resolver alerta", e.getMessage()));
        }
    }

    /**
     * DELETE /api/alertas/{id} - Remove um alerta
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAlerta(@PathVariable Long id) {
        try {
            alertaService.delete(id);
            return ResponseEntity.ok(ApiResponse.success("Alerta removido com sucesso"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Alerta não encontrado", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erro ao remover alerta", e.getMessage()));
        }
    }

    /**
     * GET /api/alertas/stats - Obtém estatísticas dos alertas
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AlertaService.AlertaStats>> getAlertaStats() {
        try {
            AlertaService.AlertaStats stats = alertaService.getStats();
            return ResponseEntity.ok(ApiResponse.success("Estatísticas carregadas", stats));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erro ao carregar estatísticas", e.getMessage()));
        }
    }

    /**
     * POST /api/alertas/generate-samples - Gera alertas de exemplo (apenas para desenvolvimento)
     */
    @PostMapping("/generate-samples")
    public ResponseEntity<ApiResponse<Void>> generateSampleAlerts() {
        try {
            alertaService.generateSampleAlerts();
            return ResponseEntity.ok(ApiResponse.success("Alertas de exemplo gerados com sucesso"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erro ao gerar alertas de exemplo", e.getMessage()));
        }
    }
}
