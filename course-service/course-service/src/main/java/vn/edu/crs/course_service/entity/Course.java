package vn.edu.crs.course_service.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "course")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ten_mon_hoc", nullable = false)
    private String tenMonHoc;

    @Column(name = "so_cho_con_lai", nullable = false)
    private Integer soChoConLai;

    @Column(name = "so_tin_chi", nullable = false)
    private Integer soTinChi;

    @Column(name = "so_cho_toi_da", nullable = false)
    private Integer soChoToiDa;
}