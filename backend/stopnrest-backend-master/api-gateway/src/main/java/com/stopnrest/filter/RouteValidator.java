package com.stopnrest.filter;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouteValidator {

    // List of open API endpoints (public endpoints)
    public static final List<String> openApiEndpoints = List.of(
            "/auth/check",
            "/auth/na/register",
            "/auth/na/login",
            "/auth/na/verify-otp",
            "/auth/na/send-registration",
            "/auth/na/forgot-password",
            "/auth/na/reset-password",
		    "/emails/send-otp",
		    "/emails/send-registration",
//            "/users/**",
                "/api/v1/hotels/filter",
            "/api/v1/hotels/search",
            "/eureka/**"
    );

    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    // Predicate to determine if a request is secured or not
    public Predicate<ServerHttpRequest> isSecured =
            request -> openApiEndpoints
                    .stream()
                    .noneMatch(uri -> pathMatcher.match(uri, request.getURI().getPath()));
}
