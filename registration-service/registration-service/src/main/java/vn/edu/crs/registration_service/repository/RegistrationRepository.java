package vn.edu.crs.registration_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.crs.registration_service.entity.Registration;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    List<Registration> findByStudentId(Long studentId);
    List<Registration> findByStudentIdAndTrangThai(Long studentId, String trangThai);
    Optional<Registration> findByStudentIdAndCourseIdAndTrangThai(Long studentId, Long courseId, String trangThai);
}