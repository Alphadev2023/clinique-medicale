package com.clinique.clinic_api.identity.infrastructure;

import com.clinique.clinic_api.identity.domain.Role;
import com.clinique.clinic_api.identity.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserJpaRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRole(Role role);
}