import type { Course } from '../types/course';
import type { LoadState } from '../api/useCourses';

interface CourseListProps {
    courses: Course[];
    state: LoadState;
    errorMessage: string;
    onRetry: () => void;
    onResetSearch?: () => void;
}

export default function CourseList({ courses, state, errorMessage, onRetry }: CourseListProps) {
    if (state === 'loading') {
        return (
            <div className="table-card animate-fade-in">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Môn học</th>
                            <th style={{ width: '140px', textAlign: 'center' }}>Số tín chỉ</th>
                            <th style={{ width: '220px' }}>Tình trạng chỗ</th>
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
                        <th style={{ width: '140px', textAlign: 'center' }}>Số tín chỉ</th>
                        <th style={{ width: '220px' }}>Số chỗ còn lại</th>
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
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
