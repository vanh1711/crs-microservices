import type { Course } from '../types/course';
import type { LoadState } from '../api/useCourses';

interface CourseListProps {
    courses: Course[];
    state: LoadState;
    errorMessage: string;
    onRetry: () => void;
    onEdit: (course: Course) => void;
    onDelete: (course: Course) => void;
}

export default function CourseList({
    courses,
    state,
    errorMessage,
    onRetry,
    onEdit,
    onDelete,
}: CourseListProps) {
    if (state === 'loading') {
        return (
            <div className="table-card animate-fade-in">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Môn học</th>
                            <th style={{ width: '130px', textAlign: 'center' }}>Số tín chỉ</th>
                            <th style={{ width: '180px' }}>Tình trạng chỗ</th>
                            <th style={{ width: '140px', textAlign: 'right' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[1, 2, 3, 4].map((item) => (
                            <tr key={item}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div className="skeleton" style={{ width: 34, height: 34, borderRadius: 8 }} />
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '60%' }}>
                                            <div className="skeleton" style={{ height: 16, width: '80%' }} />
                                            <div className="skeleton" style={{ height: 11, width: '30%' }} />
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <div className="skeleton" style={{ height: 22, width: 70, borderRadius: 20 }} />
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        <div className="skeleton" style={{ height: 14, width: 80 }} />
                                        <div className="skeleton" style={{ height: 6, width: 110, borderRadius: 10 }} />
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                                        <div className="skeleton" style={{ height: 28, width: 50, borderRadius: 6 }} />
                                        <div className="skeleton" style={{ height: 28, width: 50, borderRadius: 6 }} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    if (state === 'error') {
        return (
            <div className="table-card animate-fade-in">
                <div className="state-container">
                    <div className="state-icon error">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                    </div>
                    <div className="state-title">Không thể kết nối đến hệ thống</div>
                    <div className="state-desc">{errorMessage}</div>
                    <button className="btn-action btn-primary" onClick={onRetry}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
                        </svg>
                        Thử lại kết nối
                    </button>
                </div>
            </div>
        );
    }

    if (state === 'empty') {
        return (
            <div className="table-card animate-fade-in">
                <div className="state-container">
                    <div className="state-icon empty">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            <line x1="8" y1="11" x2="14" y2="11"></line>
                        </svg>
                    </div>
                    <div className="state-title">Không tìm thấy môn học nào</div>
                    <div className="state-desc">Không có kết quả nào phù hợp với từ khóa tìm kiếm của bạn. Hãy thử từ khóa khác.</div>
                </div>
            </div>
        );
    }

    // state === 'success'
    return (
        <div className="table-card animate-fade-in">
            <table className="custom-table">
                <thead>
                    <tr>
                        <th>Môn học</th>
                        <th style={{ width: '130px', textAlign: 'center' }}>Số tín chỉ</th>
                        <th style={{ width: '180px' }}>Số chỗ còn lại</th>
                        <th style={{ width: '140px', textAlign: 'right' }}>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course) => {
                        const percentLeft = course.soChoToiDa > 0 
                            ? Math.round((course.soChoConLai / course.soChoToiDa) * 100) 
                            : 0;

                        let badgeClass = 'badge-success';
                        let barColor = '#10b981';
                        let statusText = `Còn ${course.soChoConLai} chỗ`;

                        if (course.soChoConLai === 0) {
                            badgeClass = 'badge-danger';
                            barColor = '#ef4444';
                            statusText = 'Hết chỗ';
                        } else if (course.soChoConLai <= 5 || percentLeft < 20) {
                            badgeClass = 'badge-warning';
                            barColor = '#f59e0b';
                            statusText = `Sắp hết (${course.soChoConLai})`;
                        }

                        return (
                            <tr key={course.id}>
                                <td>
                                    <div className="course-name-cell">
                                        <div className="course-icon">
                                            {course.tenMonHoc.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="course-name">{course.tenMonHoc}</div>
                                            <div className="course-id">Mã HP: #{course.id.toString().padStart(4, '0')}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <span className="badge badge-credit">
                                        {course.soTinChi} tín chỉ
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                        <span className={`badge ${badgeClass}`}>
                                            {statusText}
                                        </span>
                                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                            {course.soChoConLai}/{course.soChoToiDa}
                                        </span>
                                    </div>
                                    <div className="seat-progress-bar">
                                        <div 
                                            className="seat-progress-fill" 
                                            style={{ 
                                                width: `${percentLeft}%`, 
                                                backgroundColor: barColor 
                                            }} 
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div className="row-actions">
                                        <button 
                                            type="button"
                                            className="btn-table-action btn-edit" 
                                            onClick={() => onEdit(course)}
                                            title="Chỉnh sửa môn học"
                                        >
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                            </svg>
                                            <span>Sửa</span>
                                        </button>
                                        <button 
                                            type="button"
                                            className="btn-table-action btn-delete" 
                                            onClick={() => onDelete(course)}
                                            title="Xóa môn học"
                                        >
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                            </svg>
                                            <span>Xóa</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
