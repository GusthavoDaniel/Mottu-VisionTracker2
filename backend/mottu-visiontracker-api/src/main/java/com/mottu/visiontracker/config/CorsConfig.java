package com.mottu.visiontracker.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(false)
                .maxAge(3600);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Permitir todas as origens (para desenvolvimento)
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        
        // Permitir métodos HTTP essenciais
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"
        ));
        
        // Permitir todos os headers
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        // NÃO permitir credenciais quando usar * em allowedOriginPatterns
        configuration.setAllowCredentials(false);
        
        // Headers expostos para o cliente
        configuration.setExposedHeaders(Arrays.asList(
            "Authorization", 
            "Cache-Control", 
            "Content-Type",
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Headers"
        ));
        
        // Tempo de cache para preflight requests
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        
        return source;
    }
}
