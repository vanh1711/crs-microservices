export default function RegisterCoursePage() {
    return (
        <div className="page-container animate-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Đăng Ký Học Phần</h1>
                    <p className="page-subtitle">Dành riêng cho sinh viên đã đăng nhập vào hệ thống</p>
                </div>
            </div>

            <div className="table-card" style={{ padding: '40px 24px', textAlign: 'center' }}>
                <div className="state-icon" style={{ background: '#e0e7ff', color: '#4f46e5', margin: '0 auto 16px' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: '#1e293b' }}>
                    Cổng Đăng Ký Học Phần Trực Tuyến
                </h3>
                <p style={{ color: '#64748b', fontSize: '14px', maxWidth: '420px', margin: '0 auto 20px' }}>
                    Chức năng này sẽ được tích hợp gọi sang <code>registration-service</code> và <code>course-service</code> hoàn chỉnh trong các buổi tiếp theo.
                </p>
                <div className="badge badge-success" style={{ padding: '6px 14px', fontSize: '12px' }}>
                    ✅ Đã bảo vệ bằng ProtectedRoute (ROLE_STUDENT)
                </div>
            </div>
        </div>
    );
}
