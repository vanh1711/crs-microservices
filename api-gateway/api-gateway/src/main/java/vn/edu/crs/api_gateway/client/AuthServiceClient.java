package vn.edu.crs.api_gateway.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

/**
 * Goi sang auth-service (endpoint noi bo) de kiem tra API Key bang WebClient
 * vi api-gateway chay tren nen reactive (WebFlux).
 */
@Component
public class AuthServiceClient {

    private final WebClient webClient;

    public AuthServiceClient(WebClient.Builder webClientBuilder,
                             @Value("${auth.service.url:${AUTH_SERVICE_URL:http://localhost:8081}}") String authServiceUrl) {
        this.webClient = webClientBuilder.baseUrl(authServiceUrl).build();
    }

    public Mono<Boolean> isValidForScope(String key, String scope) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/internal/api-keys/validate")
                        .queryParam("key", key)
                        .queryParam("scope", scope)
                        .build())
                .retrieve()
                .bodyToMono(Map.class)
                .map(res -> Boolean.TRUE.equals(res.get("valid")))
                .onErrorReturn(false); // neu auth-service khong ket noi duoc, coi nhu key khong hop le (fail-safe)
    }
}
