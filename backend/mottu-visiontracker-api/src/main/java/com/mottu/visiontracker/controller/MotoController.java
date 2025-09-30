package com.mottu.visiontracker.controller;

import com.mottu.visiontracker.dto.ApiResponse;
import com.mottu.visiontracker.dto.MotoDTO;
import com.mottu.visiontracker.entity.Moto;
import com.mottu.visiontracker.service.MotoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/motos")
@CrossOrigin(origins = "*")
public class MotoController {

    @Autowired
    private MotoService motoService;

    /**
     * GET /api/motos - Lista todas as motos
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<MotoDTO>>> getAllMotos(
            @RequestParam(required = false) String placa,
            @RequestParam(required = false) String modelo,
            @RequestParam(required = false) String proprietario,
            @RequestParam(required = false) Moto.StatusMoto status) {
        
        try {
            List<MotoDTO> motos;
            
            if (placa != null || modelo != null || proprietario != null || status != null) {
                motos = motoService.findByMultipleCriteria(placa, modelo, proprietario, status);
            } else {
                motos = motoService.findAll();
            }
            
            return ResponseEntity.ok(ApiResponse.success("Motos carregadas com sucesso", motos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erro ao carregar motos", e.getMessage()));
        }
    }

    /**
     * GET /api/motos/{id} - Busca uma moto por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MotoDTO>> getMotoById(@PathVariable Long id) {
        try {
            Optional<MotoDTO> moto = motoService.findById(id);
            
            if (moto.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success("Moto encontrada", moto.get()));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Moto não encontrada com ID: " + id));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erro ao buscar moto", e.getMessage()));
        }
    }

    /**
     * GET /api/motos/placa/{placa} - Busca uma moto por placa
     */
    @GetMapping("/placa/{placa}")
    public ResponseEntity<ApiResponse<MotoDTO>> getMotoByPlaca(@PathVariable String placa) {
        try {
            Optional<MotoDTO> moto = motoService.findByPlaca(placa);
            
            if (moto.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success("Moto encontrada", moto.get()));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Moto não encontrada com placa: " + placa));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erro ao buscar moto", e.getMessage()));
        }
    }

    /**
     * GET /api/motos/status/{status} - Busca motos por status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<MotoDTO>>> getMotosByStatus(@PathVariable Moto.StatusMoto status) {
        try {
            List<MotoDTO> motos = motoService.findByStatus(status);
            return ResponseEntity.ok(ApiResponse.success("Motos encontradas", motos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erro ao buscar motos", e.getMessage()));
        }
    }

    /**
     * POST /api/motos - Cria uma nova moto
     */
    @PostMapping
    public ResponseEntity<ApiResponse<MotoDTO>> createMoto(@Valid @RequestBody MotoDTO motoDTO, BindingResult result) {
        if (result.hasErrors()) {
            StringBuilder errors = new StringBuilder();
            result.getAllErrors().forEach(error -> errors.append(error.getDefaultMessage()).append("; "));
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Dados inválidos", errors.toString()));
        }

        try {
            MotoDTO createdMoto = motoService.create(motoDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Moto cadastrada com sucesso", createdMoto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Erro de validação", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erro ao cadastrar moto", e.getMessage()));
        }
    }

    /**
     * PUT /api/motos/{id} - Atualiza uma moto existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MotoDTO>> updateMoto(@PathVariable Long id, 
                                                           @Valid @RequestBody MotoDTO motoDTO, 
                                                           BindingResult result) {
        if (result.hasErrors()) {
            StringBuilder errors = new StringBuilder();
            result.getAllErrors().forEach(error -> errors.append(error.getDefaultMessage()).append("; "));
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Dados inválidos", errors.toString()));
        }

        try {
            MotoDTO updatedMoto = motoService.update(id, motoDTO);
            return ResponseEntity.ok(ApiResponse.success("Moto atualizada com sucesso", updatedMoto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Erro de validação", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erro ao atualizar moto", e.getMessage()));
        }
    }

    /**
     * PATCH /api/motos/{id}/position - Atualiza a posição de uma moto
     */
    @PatchMapping("/{id}/position")
    public ResponseEntity<ApiResponse<MotoDTO>> updateMotoPosition(@PathVariable Long id,
                                                                   @RequestParam String setor,
                                                                   @RequestParam String posicao) {
        try {
            MotoDTO updatedMoto = motoService.updatePosition(id, setor, posicao);
            return ResponseEntity.ok(ApiResponse.success("Posição da moto atualizada", updatedMoto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Erro de validação", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erro ao atualizar posição", e.getMessage()));
        }
    }

    /**
     * PATCH /api/motos/{id}/status - Atualiza o status de uma moto
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<MotoDTO>> updateMotoStatus(@PathVariable Long id,
                                                                 @RequestParam Moto.StatusMoto status) {
        try {
            MotoDTO updatedMoto = motoService.updateStatus(id, status);
            return ResponseEntity.ok(ApiResponse.success("Status da moto atualizado", updatedMoto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Erro de validação", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erro ao atualizar status", e.getMessage()));
        }
    }

    /**
     * DELETE /api/motos/{id} - Remove uma moto
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMoto(@PathVariable Long id) {
        try {
            motoService.delete(id);
            return ResponseEntity.ok(ApiResponse.success("Moto removida com sucesso"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Moto não encontrada", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erro ao remover moto", e.getMessage()));
        }
    }

    /**
     * GET /api/motos/stats - Obtém estatísticas das motos
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<MotoService.MotoStats>> getMotoStats() {
        try {
            MotoService.MotoStats stats = motoService.getStats();
            return ResponseEntity.ok(ApiResponse.success("Estatísticas carregadas", stats));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erro ao carregar estatísticas", e.getMessage()));
        }
    }
}
