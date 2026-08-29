package vn.edu.crs.course_service.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import vn.edu.crs.course_service.entity.Course;
import vn.edu.crs.course_service.repository.CourseRepository;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CourseRepository courseRepository;

    @Override
    public void run(String... args) {
        if (courseRepository.count() <= 1) {
            List<Course> sampleCourses = List.of(
                    Course.builder().tenMonHoc("Phát triển phần mềm hướng dịch vụ").soTinChi(3).soChoToiDa(50).soChoConLai(30).build(),
                    Course.builder().tenMonHoc("Kiến trúc và Thiết kế Phần mềm").soTinChi(3).soChoToiDa(50).soChoConLai(50).build(),
                    Course.builder().tenMonHoc("Lập trình Thiết bị Di động").soTinChi(3).soChoToiDa(45).soChoConLai(45).build(),
                    Course.builder().tenMonHoc("An toàn và Bảo mật Hệ thống Thông tin").soTinChi(2).soChoToiDa(60).soChoConLai(60).build(),
                    Course.builder().tenMonHoc("Phân tích Dữ liệu Lớn (Big Data)").soTinChi(3).soChoToiDa(50).soChoConLai(50).build(),
                    Course.builder().tenMonHoc("Trí tuệ nhân tạo và Học máy").soTinChi(4).soChoToiDa(40).soChoConLai(15).build(),
                    Course.builder().tenMonHoc("Điện toán đám mây & DevOps").soTinChi(3).soChoToiDa(55).soChoConLai(55).build(),
                    Course.builder().tenMonHoc("Mạng máy tính nâng cao").soTinChi(3).soChoToiDa(40).soChoConLai(0).build(),
                    Course.builder().tenMonHoc("Kiểm thử và Đảm bảo Chất lượng Phần mềm").soTinChi(3).soChoToiDa(45).soChoConLai(2).build(),
                    Course.builder().tenMonHoc("Quản trị Dự án Công nghệ Thông tin").soTinChi(2).soChoToiDa(60).soChoConLai(48).build()
            );

            for (Course c : sampleCourses) {
                if (!courseRepository.existsByTenMonHocIgnoreCase(c.getTenMonHoc())) {
                    courseRepository.save(c);
                }
            }
        }
    }
}
