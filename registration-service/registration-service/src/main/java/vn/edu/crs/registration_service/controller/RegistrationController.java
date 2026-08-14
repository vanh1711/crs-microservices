package vn.edu.crs.registration_service.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.crs.registration_service.dto.RegistrationRequest;
import vn.edu.crs.registration_service.entity.Registration;
import vn.edu.crs.registration_service.service.RegistrationService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/registrations")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @PostMapping
    public ResponseEntity<Registration> registerCourse(@Valid @RequestBody RegistrationRequest request) {
        Registration registration = registrationService.registerCourse(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(registration);
    }
}