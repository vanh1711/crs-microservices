import { useState, useEffect } from 'react';
import type { Course, CourseFormValues } from '../types/course';
import { emptyCourseForm } from '../types/course';

interface CourseFormProps {
    editingCourse: Course | null; // null = đang ở chế độ Thêm; có giá trị = đang Sửa
    onSubmit: (values: CourseFormValues) => Promise<void>;
    onCancel: () => void;
    submitting: boolean;
    serverError: string | null;
}

export default function CourseForm({
    editingCourse,
    onSubmit,
    onCancel,
    submitting,
    serverError,
}: CourseFormProps) {
    const [values, setValues] = useState<CourseFormValues>(emptyCourseForm);
    const [clientErrors, setClientErrors] = useState<Partial<CourseFormValues>>({});

    // Mỗi lần editingCourse thay đổi (bấm nút Sửa trên 1 dòng khác), mồi lại dữ liệu vào form
    useEffect(() => {
        if (editingCourse) {
            setValues({
                tenMonHoc: editingCourse.tenMonHoc,
                soTinChi: String(editingCourse.soTinChi),
                soChoToiDa: String(editingCourse.soChoToiDa),
            });
        } else {
            setValues(emptyCourseForm);
        }
        setClientErrors({});
    }, [editingCourse]);

    const validate = (): boolean => {
        const errors: Partial<CourseFormValues> = {};
        if (!values.tenMonHoc.trim()) {
            errors.tenMonHoc = 'Tên môn học không được để trống';
        }
        const soTinChi = Number(values.soTinChi);
        if (!values.soTinChi || isNaN(soTinChi) || soTinChi <= 0) {
            errors.soTinChi = 'Số tín chỉ phải là số lớn hơn 0';
        }
        const soChoToiDa = Number(values.soChoToiDa);
        if (!values.soChoToiDa || isNaN(soChoToiDa) || soChoToiDa <= 0) {
            errors.soChoToiDa = 'Số chỗ tối đa phải là số lớn hơn 0';
        }
        setClientErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        await onSubmit(values);
    };

    return (
        <div className="form-card animate-fade-in">
            <div className="form-header">
                <div className="form-header-title">
                    <div className="form-icon">
                        {editingCourse ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        )}
                    </div>
                    <div>
                        <h2 className="form-title">{editingCourse ? `Chỉnh sửa môn học: ${editingCourse.tenMonHoc}` : 'Thêm môn học mới'}</h2>
                        <p className="form-subtitle">{editingCourse ? 'Cập nhật thông tin học phần vào hệ thống' : 'Nhập thông tin môn học để mở lớp đăng ký'}</p>
                    </div>
                </div>

                {editingCourse && (
                    <span className="badge badge-warning" style={{ alignSelf: 'flex-start' }}>
                        Đang ở chế độ Sửa
                    </span>
                )}
            </div>

            {serverError && (
                <div className="server-error-banner animate-fade-in">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span>{serverError}</span>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="form-group form-group-full">
                        <label className="form-label">
                            Tên môn học <span className="required-star">*</span>
                        </label>
                        <input
                            type="text"
                            className={`form-input ${clientErrors.tenMonHoc ? 'has-error' : ''}`}
                            value={values.tenMonHoc}
                            onChange={(e) => setValues({ ...values, tenMonHoc: e.target.value })}
                            placeholder="Ví dụ: Kiến trúc và Thiết kế Phần mềm"
                        />
                        {clientErrors.tenMonHoc && <span className="form-error-msg">{clientErrors.tenMonHoc}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Số tín chỉ <span className="required-star">*</span>
                        </label>
                        <input
                            type="number"
                            className={`form-input ${clientErrors.soTinChi ? 'has-error' : ''}`}
                            value={values.soTinChi}
                            onChange={(e) => setValues({ ...values, soTinChi: e.target.value })}
                            placeholder="Ví dụ: 3"
                            min="1"
                        />
                        {clientErrors.soTinChi && <span className="form-error-msg">{clientErrors.soTinChi}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Số chỗ tối đa <span className="required-star">*</span>
                        </label>
                        <input
                            type="number"
                            className={`form-input ${clientErrors.soChoToiDa ? 'has-error' : ''}`}
                            value={values.soChoToiDa}
                            onChange={(e) => setValues({ ...values, soChoToiDa: e.target.value })}
                            placeholder="Ví dụ: 50"
                            min="1"
                        />
                        {clientErrors.soChoToiDa && <span className="form-error-msg">{clientErrors.soChoToiDa}</span>}
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-action btn-primary" disabled={submitting}>
                        {submitting ? (
                            <>
                                <span className="spinner"></span>
                                <span>Đang lưu...</span>
                            </>
                        ) : (
                            <>
                                {editingCourse ? (
                                    <>
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                        <span>Cập nhật môn học</span>
                                    </>
                                ) : (
                                    <>
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <line x1="12" y1="5" x2="12" y2="19"></line>
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                        </svg>
                                        <span>Thêm môn học</span>
                                    </>
                                )}
                            </>
                        )}
                    </button>

                    {editingCourse && (
                        <button type="button" className="btn-action btn-secondary" onClick={onCancel} disabled={submitting}>
                            Hủy bỏ
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
