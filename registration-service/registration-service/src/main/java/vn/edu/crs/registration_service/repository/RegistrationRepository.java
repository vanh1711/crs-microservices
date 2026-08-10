package vn.edu.crs.registration_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.crs.registration_service.entity.Registration;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    // Spring Data JPA sẽ tự động tạo query kiểm tra sinh viên đã đăng ký môn chưa
    boolean existsByStudentIdAndCourseIdAndTrangThai(Long studentId, Long courseId, String trangThai);
}