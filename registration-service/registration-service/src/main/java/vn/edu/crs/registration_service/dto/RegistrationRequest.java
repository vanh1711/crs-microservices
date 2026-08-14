package vn.edu.crs.registration_service.dto;

import jakarta.validation.constraints.NotNull;

public class RegistrationRequest {

    @NotNull(message = "Student ID không được để trống")
    private String studentId;

    @NotNull(message = "Course ID không được để trống")
    private Long courseId;

    public RegistrationRequest() {
    }

    public RegistrationRequest(String studentId, Long courseId) {
        this.studentId = studentId;
        this.courseId = courseId;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }
}