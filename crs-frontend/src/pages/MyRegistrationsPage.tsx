import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { getMyRegistrations, cancelRegistration } from '../api/registrationApi';
import { getCourseById } from '../api/courseApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import type { Registration } from '../types/registration';
import type { Course } from '../types/course';
import type { ApiErrorResponse } from '../types/apiError';

interface RegistrationRow extends Registration {
    courseName: string;
    soTinChi?: number;
}

export default function MyRegistrationsPage() {
    const [rows, setRows] = useState<RegistrationRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [cancellingId, setCancellingId] = useState<number | null>(null);

    const { user } = useAuth();
    const { toast, showToast, clearToast } = useToast();

    const loadData = useCallback(async () => {
        setLoading(true);
        setLoadError(null);
        try {
            const res = await getMyRegistrations();
            const activeRegistrations = res.data.filter((r) => r.trangThai === 'DA_DANG_KY');

            // Ghép tên môn học cho từng dòng - gọi song song bằng Promise.all
            const enriched = await Promise.all(
                activeRegistrations.map(async (reg) => {
                    try {
                        const courseRes = await getCourseById(reg.courseId);
                        const course = courseRes.data as Course;
                        return {
                            ...reg,
                            courseName: course.tenMonHoc,
                            soTinChi: course.soTinChi,
                        };
                    } catch {
                        // Nếu không lấy được tên môn (ví dụ môn đã bị Admin xóa), vẫn hiện dòng này
                        return {
                            ...reg,
                            courseName: `Môn học #${reg.courseId} (Không tìm thấy thông tin)`,
                        };
                    }
                })
            );
            setRows(enriched);
        } catch (err) {
            let message = 'Không tải được danh sách đăng ký.';
            if (axios.isAxiosError<ApiErrorResponse>(err) && err.response?.data?.message) {
                message = err.response.data.message;
            }
            setLoadError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleCancel = async (row: RegistrationRow) => {
        if (!window.confirm(`Bạn có chắc chắn muốn hủy đăng ký môn "${row.courseName}"?`)) return;

        setCancellingId(row.id);
        try {
            await cancelRegistration(row.id);
            showToast(`Đã hủy đăng ký môn "${row.courseName}" thành công`, 'success');
            loadData(); // Tải lại danh sách sau khi hủy
        } catch (err) {
            let message = 'Hủy đăng ký không thành công.';
            if (axios.isAxiosError<ApiErrorResponse>(err) && err.response?.data?.message) {
                message = err.response.data.message;
            }
            showToast(message, 'error');
        } finally {
            setCancellingId(null);
        }
    };

    return (
        <div className="page-container animate-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Môn Học Đã Đăng Ký</h1>
                    <p className="page-subtitle">Xem danh sách các học phần bạn đang tham gia và quản lý hủy đăng ký</p>
                </div>
                {user && (
                    <div className="badge badge-credit" style={{ padding: '6px 14px', fontSize: '13px' }}>
                        📚 Tổng số môn đã đăng ký: <strong>{rows.length}</strong>
                    </div>
                )}
            </div>

            {loading && (
                <div className="table-card animate-fade-in">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Tên môn học</th>
                                <th style={{ width: '130px', textAlign: 'center' }}>Số tín chỉ</th>
                                <th style={{ width: '200px' }}>Ngày đăng ký</th>
                                <th style={{ width: '140px', textAlign: 'right' }}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3].map((item) => (
                                <tr key={item}>
                                    <td>
                                        <div className="skeleton" style={{ height: 20, width: '70%' }} />
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <div className="skeleton" style={{ height: 22, width: 60, borderRadius: 20 }} />
                                        </div>
                                    </td>
                                    <td>
                                        <div className="skeleton" style={{ height: 16, width: 140 }} />
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <div className="skeleton" style={{ height: 28, width: 75, borderRadius: 6 }} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!loading && loadError && (
                <div className="table-card animate-fade-in">
                    <div className="state-container">
                        <div className="state-icon error">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                        </div>
                        <div className="state-title">Không thể tải dữ liệu đăng ký</div>
                        <div className="state-desc">{loadError}</div>
                        <button className="btn-action btn-primary" onClick={loadData}>
                            Thử lại
                        </button>
                    </div>
                </div>
            )}

            {!loading && !loadError && rows.length === 0 && (
                <div className="table-card animate-fade-in">
                    <div className="state-container">
                        <div className="state-icon empty">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                        </div>
                        <div className="state-title">Bạn chưa đăng ký môn học nào</div>
                        <div className="state-desc">Hãy truy cập mục "Đăng ký học phần" để chọn các môn học phù hợp với chương trình của bạn.</div>
                    </div>
                </div>
            )}

            {!loading && !loadError && rows.length > 0 && (
                <div className="table-card animate-fade-in">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Tên môn học</th>
                                <th style={{ width: '130px', textAlign: 'center' }}>Số tín chỉ</th>
                                <th style={{ width: '200px' }}>Ngày đăng ký</th>
                                <th style={{ width: '140px', textAlign: 'right' }}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row) => {
                                const isCancelling = cancellingId === row.id;
                                const dateFormatted = row.ngayDangKy 
                                    ? new Date(row.ngayDangKy).toLocaleString('vi-VN') 
                                    : 'Vừa xong';

                                return (
                                    <tr key={row.id}>
                                        <td>
                                            <div className="course-name-cell">
                                                <div className="course-icon">
                                                    {row.courseName.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="course-name">{row.courseName}</div>
                                                    <div className="course-id">Mã ĐK: #{row.id} • Mã HP: #{row.courseId}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span className="badge badge-credit">
                                                {row.soTinChi ? `${row.soTinChi} tín chỉ` : '3 tín chỉ'}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                                {dateFormatted}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="row-actions">
                                                <button
                                                    type="button"
                                                    className="btn-table-action btn-delete"
                                                    onClick={() => handleCancel(row)}
                                                    disabled={isCancelling}
                                                    title="Hủy đăng ký môn học này"
                                                >
                                                    {isCancelling ? (
                                                        <>
                                                            <span className="spinner" style={{ width: 11, height: 11 }}></span>
                                                            <span>Đang hủy...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                            </svg>
                                                            <span>Hủy đăng ký</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}
        </div>
    );
}
