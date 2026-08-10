package vn.edu.crs.course_service.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import vn.edu.crs.course_service.entity.Course;
import vn.edu.crs.course_service.repository.CourseRepository;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final CourseRepository courseRepository;

    @Override
    public void run(String... args) {
        if (courseRepository.findById(1L).isEmpty()) {
            Course course = Course.builder()
                    .tenMonHoc("Phat trien phan mem huong dich vu")
                    .soChoConLai(30)
                    .soTinChi(3)
                    .soChoToiDa(50)
                    .build();
            courseRepository.save(course);
            System.out.println("=== Khoi tao mon hoc mau thanh cong ===");
        }
    }
}