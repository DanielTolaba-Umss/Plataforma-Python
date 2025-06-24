package com.coders.backers.plataformapython.backend.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.data.redis.connection.RedisConnectionFactory;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.Map;

/**
 * Configuración de Redis embebido para desarrollo
 * Se activa con el perfil 'dev' cuando no hay Redis disponible
 */
@Configuration
@Profile("dev")
@Slf4j
public class EmbeddedRedisConfig {

    /**
     * Bean condicional que solo se crea si no existe un RedisTemplate real
     */
    @Bean
    @ConditionalOnMissingBean(RedisConnectionFactory.class)
    public EmbeddedRedisService embeddedRedisService() {
        log.warn("🔶 INICIANDO REDIS EMBEBIDO - Solo para desarrollo");
        log.warn("🔶 Los tokens no persistirán entre reinicios de la aplicación");
        
        return new EmbeddedRedisService();
    }

    /**
     * Servicio simple que simula las operaciones de Redis que necesitamos
     */
    public static class EmbeddedRedisService {
        
        private final Map<String, Object> storage = new ConcurrentHashMap<>();
        private final Map<String, Long> expiration = new ConcurrentHashMap<>();
        private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
        
        public EmbeddedRedisService() {
            // Limpiar datos expirados cada minuto
            scheduler.scheduleAtFixedRate(this::cleanExpiredKeys, 1, 1, TimeUnit.MINUTES);
            log.info("✅ Redis embebido inicializado correctamente");
        }
        
        /**
         * Almacena un valor con expiración
         */
        public void setWithExpiration(String key, Object value, long timeout, TimeUnit unit) {
            storage.put(key, value);
            expiration.put(key, System.currentTimeMillis() + unit.toMillis(timeout));
            log.debug("🔸 Redis embebido: SET {} = {} (expire in {} {})", key, value, timeout, unit);
        }
        
        /**
         * Almacena un valor sin expiración
         */
        public void set(String key, Object value) {
            storage.put(key, value);
            expiration.remove(key); // Sin expiración
            log.debug("🔸 Redis embebido: SET {} = {}", key, value);
        }
        
        /**
         * Obtiene un valor
         */
        public Object get(String key) {
            // Verificar expiración
            Long expTime = expiration.get(key);
            if (expTime != null && expTime < System.currentTimeMillis()) {
                storage.remove(key);
                expiration.remove(key);
                log.debug("🔸 Redis embebido: GET {} = null (expired)", key);
                return null;
            }
            
            Object value = storage.get(key);
            log.debug("🔸 Redis embebido: GET {} = {}", key, value);
            return value;
        }
        
        /**
         * Elimina un valor
         */
        public boolean delete(String key) {
            boolean existed = storage.containsKey(key);
            storage.remove(key);
            expiration.remove(key);
            log.debug("🔸 Redis embebido: DELETE {} = {}", key, existed);
            return existed;
        }
        
        /**
         * Verifica si existe una key
         */
        public boolean exists(String key) {
            // Verificar expiración primero
            Long expTime = expiration.get(key);
            if (expTime != null && expTime < System.currentTimeMillis()) {
                storage.remove(key);
                expiration.remove(key);
                return false;
            }
            return storage.containsKey(key);
        }
        
        /**
         * Limpia las keys expiradas
         */
        private void cleanExpiredKeys() {
            long now = System.currentTimeMillis();
            int cleaned = 0;
            
            var iterator = expiration.entrySet().iterator();
            while (iterator.hasNext()) {
                var entry = iterator.next();
                if (entry.getValue() < now) {
                    storage.remove(entry.getKey());
                    iterator.remove();
                    cleaned++;
                }
            }
            
            if (cleaned > 0) {
                log.debug("🧹 Redis embebido: Limpiadas {} keys expiradas", cleaned);
            }
        }
        
        /**
         * Obtiene estadísticas del almacén
         */
        public Map<String, Object> getStats() {
            return Map.of(
                "totalKeys", storage.size(),
                "keysWithExpiration", expiration.size(),
                "keysWithoutExpiration", storage.size() - expiration.size()
            );
        }
    }
}
