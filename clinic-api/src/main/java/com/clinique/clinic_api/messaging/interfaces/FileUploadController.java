package com.clinique.clinic_api.messaging.interfaces;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
@SecurityRequirement(name = "bearerAuth")
public class FileUploadController {

    @Value("${upload.dir:uploads}")
    private String uploadDir;

    @PostMapping("/image")
    @PreAuthorize("hasAnyRole('ADMIN', 'MEDECIN', 'SECRETAIRE')")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            // Vérifie que c'est une image
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Seules les images sont autorisées"));
            }

            // Vérifie la taille (max 5MB)
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Image trop grande (max 5MB)"));
            }

            // Crée le dossier si nécessaire
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Génère un nom unique
            String extension = file.getOriginalFilename() != null
                    ? file.getOriginalFilename().substring(
                    file.getOriginalFilename().lastIndexOf('.'))
                    : ".jpg";
            String filename = UUID.randomUUID() + extension;

            // Sauvegarde le fichier
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath,
                    StandardCopyOption.REPLACE_EXISTING);

            String imageUrl = "/api/upload/images/" + filename;
            return ResponseEntity.ok(Map.of("url", imageUrl));

        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Erreur lors de l'upload"));
        }
    }

    @GetMapping("/images/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(filename);
            byte[] image = Files.readAllBytes(filePath);
            String contentType = Files.probeContentType(filePath);
            return ResponseEntity.ok()
                    .header("Content-Type", contentType != null ? contentType : "image/jpeg")
                    .body(image);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }
}