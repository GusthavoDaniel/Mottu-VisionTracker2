package com.mottu.visiontracker.controller;

import com.mottu.visiontracker.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@CrossOrigin(origins = "*")
public class HealthController {

    @Autowired
    private DataSource dataSource;

    /**
     * GET /api/health - Verifica o status da API
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> healthCheck() {
        Map<String, Object> healthData = new HashMap<>();
        
        try {
            // Informações básicas
            healthData.put("status", "UP");
            healthData.put("timestamp", LocalDateTime.now());
            healthData.put("service", "Mottu VisionTracker API");
            healthData.put("version", "1.0.0");
            
            // Verificar conexão com o banco de dados
            try (Connection connection = dataSource.getConnection()) {
                boolean dbConnected = connection != null && !connection.isClosed();
                healthData.put("database", dbConnected ? "UP" : "DOWN");
                
                if (dbConnected) {
                    healthData.put("databaseUrl", connection.getMetaData().getURL());
                }
            } catch (Exception e) {
                healthData.put("database", "DOWN");
                healthData.put("databaseError", e.getMessage());
            }
            
            // Informações do sistema
            Runtime runtime = Runtime.getRuntime();
            Map<String, Object> systemInfo = new HashMap<>();
            systemInfo.put("totalMemory", runtime.totalMemory());
            systemInfo.put("freeMemory", runtime.freeMemory());
            systemInfo.put("usedMemory", runtime.totalMemory() - runtime.freeMemory());
            systemInfo.put("maxMemory", runtime.maxMemory());
            systemInfo.put("availableProcessors", runtime.availableProcessors());
            
            healthData.put("system", systemInfo);
            
            // Informações da JVM
            Map<String, Object> jvmInfo = new HashMap<>();
            jvmInfo.put("javaVersion", System.getProperty("java.version"));
            jvmInfo.put("javaVendor", System.getProperty("java.vendor"));
            jvmInfo.put("osName", System.getProperty("os.name"));
            jvmInfo.put("osVersion", System.getProperty("os.version"));
            jvmInfo.put("osArch", System.getProperty("os.arch"));
            
            healthData.put("jvm", jvmInfo);
            
            return ResponseEntity.ok(ApiResponse.success("API está funcionando corretamente", healthData));
            
        } catch (Exception e) {
            healthData.put("status", "DOWN");
            healthData.put("error", e.getMessage());
            healthData.put("timestamp", LocalDateTime.now());
            
            return ResponseEntity.status(503)
                    .body(ApiResponse.<Map<String, Object>>error("Erro no health check"));
        }
    }

    /**
     * GET /api/health/simple - Verificação simples de status
     */
    @GetMapping("/simple")
    public ResponseEntity<ApiResponse<String>> simpleHealthCheck() {
        return ResponseEntity.ok(ApiResponse.success("API está online", "OK"));
    }

    /**
     * GET /api/health/database - Verifica apenas a conexão com o banco
     */
    @GetMapping("/database")
    public ResponseEntity<ApiResponse<Map<String, Object>>> databaseHealthCheck() {
        Map<String, Object> dbInfo = new HashMap<>();
        
        try (Connection connection = dataSource.getConnection()) {
            boolean dbConnected = connection != null && !connection.isClosed();
            
            dbInfo.put("status", dbConnected ? "UP" : "DOWN");
            dbInfo.put("timestamp", LocalDateTime.now());
            
            if (dbConnected) {
                dbInfo.put("url", connection.getMetaData().getURL());
                dbInfo.put("driverName", connection.getMetaData().getDriverName());
                dbInfo.put("driverVersion", connection.getMetaData().getDriverVersion());
                dbInfo.put("productName", connection.getMetaData().getDatabaseProductName());
                dbInfo.put("productVersion", connection.getMetaData().getDatabaseProductVersion());
            }
            
            return ResponseEntity.ok(ApiResponse.success("Verificação do banco concluída", dbInfo));
            
        } catch (Exception e) {
            dbInfo.put("status", "DOWN");
            dbInfo.put("error", e.getMessage());
            dbInfo.put("timestamp", LocalDateTime.now());
            
            return ResponseEntity.status(503)
                    .body(ApiResponse.<Map<String, Object>>error("Erro na conexão com o banco"));
        }
    }
}
