package vn.edu.crs.course_service.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.crs.course_service.service.CourseService;

@RestController
@RequestMapping("/internal/courses")
@RequiredArgsConstructor
public class InternalCourseController {

    private final CourseService courseService;

    // API giữ chỗ (giảm chỗ trống)
    @PatchMapping("/{id}/reserve-seat")
    public ResponseEntity<String> reserveSeat(@PathVariable Long id) {
        courseService.reserveSeat(id);
        return ResponseEntity.ok("Giu cho thanh cong");
    }

    // API nhả chỗ (tăng chỗ trống khi hủy đăng ký)
    @PatchMapping("/{id}/release-seat")
    public ResponseEntity<String> releaseSeat(@PathVariable Long id) {
        courseService.releaseSeat(id);
        return ResponseEntity.ok("Nha cho thanh cong");
    }
}