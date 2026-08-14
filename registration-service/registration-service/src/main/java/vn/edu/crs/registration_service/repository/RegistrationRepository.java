package vn.edu.crs.registration_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.crs.registration_service.entity.Registration;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {
}