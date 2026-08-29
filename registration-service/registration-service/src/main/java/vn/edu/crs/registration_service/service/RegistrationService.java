package vn.edu.crs.registration_service.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestClient;
import vn.edu.crs.registration_service.dto.RegistrationRequest;
import vn.edu.crs.registration_service.entity.Registration;
import vn.edu.crs.registration_service.repository.RegistrationRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final RestClient restClient;

    @Value("${course-service.base-url:http://localhost:8082}")
    private String courseServiceUrl;

    public RegistrationService(RegistrationRepository registrationRepository) {
        this.registrationRepository = registrationRepository;
        this.restClient = RestClient.create();
    }

    @Transactional
    public Registration registerCourse(RegistrationRequest request) {
        // 1. Kiểm tra xem sinh viên đã đăng ký môn học này chưa
        if (registrationRepository.findByStudentIdAndCourseIdAndTrangThai(
                request.getStudentId(), request.getCourseId(), "DA_DANG_KY").isPresent()) {
            throw new IllegalArgumentException("Sinh vien da dang ky mon hoc nay roi");
        }

        // 2. Gọi sang course-service để giữ chỗ (reserve-seat)
        try {
            restClient.patch()
                    .uri(courseServiceUrl + "/internal/courses/" + request.getCourseId() + "/reserve-seat")
                    .retrieve()
                    .toBodilessEntity();
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            String errorBody = e.getResponseBodyAsString();
            if (errorBody != null && (errorBody.contains("het cho") || errorBody.contains("Mon hoc da het cho"))) {
                throw new IllegalStateException("Mon hoc da het cho trong");
            }
            if (errorBody != null && errorBody.contains("khong ton tai")) {
                throw new NoSuchElementException("Mon hoc khong ton tai id = " + request.getCourseId());
            }
            throw new IllegalStateException("Loi khi giu cho: " + (errorBody != null && !errorBody.isBlank() ? errorBody : e.getMessage()));
        } catch (Exception e) {
            throw new IllegalStateException("Khong the ket noi toi course-service de giu cho");
        }

        // 3. Lưu bản ghi đăng ký vào DB
        Registration registration = new Registration(
                null,
                request.getStudentId(),
                request.getCourseId(),
                LocalDateTime.now(),
                "DA_DANG_KY"
        );
        return registrationRepository.save(registration);
    }

    @Transactional
    public void cancelRegistration(Long id) {
        Registration reg = registrationRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Khong tim thay ban ghi dang ky id = " + id));

        if ("DA_DANG_KY".equals(reg.getTrangThai())) {
            // Nhả chỗ ở course-service
            try {
                restClient.patch()
                        .uri(courseServiceUrl + "/internal/courses/" + reg.getCourseId() + "/release-seat")
                        .retrieve()
                        .toBodilessEntity();
            } catch (Exception e) {
                // Log and continue
            }
            reg.setTrangThai("DA_HUY");
            registrationRepository.save(reg);
        }
    }

    public List<Registration> getMyRegistrations(Long studentId) {
        return registrationRepository.findByStudentId(studentId);
    }
}