package vn.edu.crs.registration_service.service;

import org.springframework.stereotype.Service;
import vn.edu.crs.registration_service.dto.RegistrationRequest;
import vn.edu.crs.registration_service.entity.Registration;
import vn.edu.crs.registration_service.repository.RegistrationRepository;

import java.time.LocalDateTime;

@Service
public class RegistrationService {

    private final RegistrationRepository registrationRepository;

    public RegistrationService(RegistrationRepository registrationRepository) {
        this.registrationRepository = registrationRepository;
    }

    public Registration registerCourse(RegistrationRequest request) {
        Registration registration = new Registration(
                request.getStudentId(),
                request.getCourseId(),
                LocalDateTime.now()
        );
        return registrationRepository.save(registration);
    }
}