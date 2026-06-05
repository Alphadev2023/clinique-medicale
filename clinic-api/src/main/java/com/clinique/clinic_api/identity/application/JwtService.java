package com.clinique.clinic_api.identity.application;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration}")
    private long expiration;

    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(String email, String role) {
        return Jwts.builder()
                .subject(email)                          // setSubject() → subject()
                .claims(Map.of("role", role))            // addClaims()  → claims()
                .issuedAt(new Date())                    // setIssuedAt() → issuedAt()
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getKey())                      // plus besoin de préciser l'algo
                .compact();
    }

    public String extractEmail(String token) {
        return getClaims(token).getSubject();
    }

    public String extractRole(String token) {
        return getClaims(token).get("role", String.class);
    }

    public boolean isTokenValid(String token) {
        try {
            getClaims(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    private Claims getClaims(String token) {
        return Jwts.parser()                             // parserBuilder() → parser()
                .verifyWith(getKey())                    // setSigningKey() → verifyWith()
                .build()
                .parseSignedClaims(token)                // parseClaimsJws() → parseSignedClaims()
                .getPayload();                           // getBody() → getPayload()
    }
}