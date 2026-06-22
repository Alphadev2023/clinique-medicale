package com.clinique.clinic_api.identity;

import com.clinique.clinic_api.identity.application.AuthService;
import com.clinique.clinic_api.identity.application.JwtService;
import com.clinique.clinic_api.identity.domain.Role;
import com.clinique.clinic_api.identity.domain.User;
import com.clinique.clinic_api.identity.infrastructure.UserJpaRepository;
import com.clinique.clinic_api.identity.interfaces.dto.AuthResponse;
import com.clinique.clinic_api.identity.interfaces.dto.LoginRequest;
import com.clinique.clinic_api.identity.interfaces.dto.RegisterRequest;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Tests AuthService")
class AuthServiceTest {

    @Mock private UserJpaRepository userRepo;
    @Mock private JwtService        jwtService;
    @Mock private PasswordEncoder   passwordEncoder;

    @InjectMocks private AuthService authService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id("user-123")
                .email("admin@clinique.com")
                .password("encodedPassword")
                .nom("Dupont")
                .prenom("Jean")
                .role(Role.ADMIN)
                .actif(true)
                .build();
    }

    @Test
    @DisplayName("Login réussi avec credentials valides")
    void login_success() {
        LoginRequest req = new LoginRequest("admin@clinique.com", "admin123");
        when(userRepo.findByEmail("admin@clinique.com"))
                .thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("admin123", "encodedPassword"))
                .thenReturn(true);
        when(jwtService.generateToken(anyString(), anyString(), anyString()))
                .thenReturn("jwt-token");

        AuthResponse response = authService.login(req);

        assertThat(response).isNotNull();
        assertThat(response.token()).isEqualTo("jwt-token");
        assertThat(response.role()).isEqualTo("ADMIN");
        assertThat(response.nom()).isEqualTo("Dupont");
        verify(userRepo, times(1)).findByEmail("admin@clinique.com");
    }

    @Test
    @DisplayName("Login échoue avec email inconnu")
    void login_fail_unknown_email() {
        LoginRequest req = new LoginRequest("inconnu@test.com", "password");
        when(userRepo.findByEmail("inconnu@test.com"))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Email ou mot de passe incorrect");
    }

    @Test
    @DisplayName("Login échoue avec mauvais mot de passe")
    void login_fail_wrong_password() {
        LoginRequest req = new LoginRequest("admin@clinique.com", "mauvais");
        when(userRepo.findByEmail("admin@clinique.com"))
                .thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("mauvais", "encodedPassword"))
                .thenReturn(false);

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Email ou mot de passe incorrect");
    }

    @Test
    @DisplayName("Register réussi avec données valides")
    void register_success() {
        RegisterRequest req = new RegisterRequest(
                "nouveau@clinique.com", "password123",
                "Martin", "Sophie", Role.MEDECIN
        );
        when(userRepo.existsByEmail("nouveau@clinique.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPass");
        when(userRepo.save(any(User.class))).thenReturn(testUser);
        when(jwtService.generateToken(anyString(), anyString(), anyString()))
                .thenReturn("jwt-token");

        AuthResponse response = authService.register(req);

        assertThat(response).isNotNull();
        verify(userRepo, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Register échoue si email déjà utilisé")
    void register_fail_email_taken() {
        RegisterRequest req = new RegisterRequest(
                "admin@clinique.com", "password123",
                "Dupont", "Jean", Role.ADMIN
        );
        when(userRepo.existsByEmail("admin@clinique.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Email déjà utilisé");
    }
}