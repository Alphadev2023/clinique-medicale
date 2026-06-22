package com.clinique.clinic_api.identity.interfaces;

import com.clinique.clinic_api.identity.domain.Role;
import com.clinique.clinic_api.identity.domain.User;
import com.clinique.clinic_api.identity.infrastructure.UserJpaRepository;
import com.clinique.clinic_api.identity.interfaces.dto.ChangePasswordRequest;
import com.clinique.clinic_api.identity.interfaces.dto.ResetPasswordRequest;
import com.clinique.clinic_api.identity.interfaces.dto.UpdateProfileRequest;
import com.clinique.clinic_api.identity.interfaces.dto.UpdateUserRequest;
import com.clinique.clinic_api.identity.interfaces.dto.UserResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class UserController {

    private final UserJpaRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/medecins")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETAIRE', 'MEDECIN')")
    public ResponseEntity<List<UserResponse>> getMedecins() {
        return ResponseEntity.ok(
                userRepo.findByRole(Role.MEDECIN)
                        .stream()
                        .map(u -> new UserResponse(
                                u.getId(), u.getNom(),
                                u.getPrenom(), u.getEmail(), u.getRole(),
                                u.isActif()
                        ))
                        .toList()
        );
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MEDECIN', 'SECRETAIRE')")
    public ResponseEntity<List<UserResponse>> getAll() {
        return ResponseEntity.ok(
                userRepo.findAll()
                        .stream()
                        .map(u -> new UserResponse(
                                u.getId(), u.getNom(),
                                u.getPrenom(), u.getEmail(), u.getRole(),
                                u.isActif()
                        ))
                        .toList()
        );
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> getMe(
            org.springframework.security.core.Authentication auth) {
        String email = auth.getName();
        return userRepo.findByEmail(email)
                .map(u -> ResponseEntity.ok(new UserResponse(
                        u.getId(), u.getNom(), u.getPrenom(),
                        u.getEmail(), u.getRole(),
                        u.isActif()
                )))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> updateMe(
            org.springframework.security.core.Authentication auth,
            @RequestBody UpdateProfileRequest req) {
        String email = auth.getName();
        return userRepo.findByEmail(email)
                .map(u -> {
                    u.setNom(req.nom());
                    u.setPrenom(req.prenom());
                    userRepo.save(u);
                    return ResponseEntity.ok(new UserResponse(
                            u.getId(), u.getNom(), u.getPrenom(),
                            u.getEmail(), u.getRole(),
                            u.isActif()
                    ));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/me/password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> changePassword(
            org.springframework.security.core.Authentication auth,
            @RequestBody ChangePasswordRequest req) {

        String email = auth.getName();
        User user = userRepo.findByEmail(email).orElse(null);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        if (!passwordEncoder.matches(req.ancienMotDePasse(), user.getPassword())) {
            return ResponseEntity.<Void>badRequest().build();
        }

        user.setPassword(passwordEncoder.encode(req.nouveauMotDePasse()));
        userRepo.save(user);
        return ResponseEntity.<Void>ok().build();
    }

    @PutMapping("/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> toggleActif(@PathVariable String id) {
        return userRepo.findById(id)
                .map(u -> {
                    u.setActif(!u.isActif());
                    userRepo.save(u);
                    return ResponseEntity.ok(new UserResponse(
                            u.getId(), u.getNom(), u.getPrenom(),
                            u.getEmail(), u.getRole(),
                            u.isActif()
                    ));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable String id,
            @jakarta.validation.Valid @RequestBody UpdateUserRequest req) {

        User user = userRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));

        if (!user.getEmail().equalsIgnoreCase(req.email()) && userRepo.existsByEmail(req.email())) {
            throw new IllegalArgumentException("Cet email est déjà utilisé par un autre compte");
        }

        user.setNom(req.nom());
        user.setPrenom(req.prenom());
        user.setEmail(req.email());
        user.setRole(req.role());
        userRepo.save(user);

        return ResponseEntity.ok(new UserResponse(
                user.getId(), user.getNom(), user.getPrenom(),
                user.getEmail(), user.getRole(), user.isActif()
        ));
    }

    @PutMapping("/{id}/reset-password")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> resetPassword(
            @PathVariable String id,
            @jakarta.validation.Valid @RequestBody ResetPasswordRequest req) {

        User user = userRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));

        user.setPassword(passwordEncoder.encode(req.nouveauMotDePasse()));
        userRepo.save(user);

        return ResponseEntity.noContent().build();
    }
}