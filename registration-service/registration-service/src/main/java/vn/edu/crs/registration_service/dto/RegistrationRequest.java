package vn.edu.crs.registration_service.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationRequest {

    @NotNull(message = "Student ID không được để trống")
    private Long studentId;

    @NotNull(message = "Course ID không được để trống")
    private Long courseId;
}