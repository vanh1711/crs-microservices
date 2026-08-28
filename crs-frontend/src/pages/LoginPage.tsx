import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { login as loginApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import type { ApiErrorResponse } from '../types/apiError';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!username.trim() || !password) {
            setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
            return;
        }

        setSubmitting(true);
        try {
            const res = await loginApi({ username: username.trim(), password });
            login(res.data);
            navigate('/courses');
        } catch (err) {
            if (axios.isAxiosError<ApiErrorResponse>(err)) {
                if (err.response?.data?.message) {
                    setError(err.response.data.message);
                } else if (err.response?.status === 401) {
                    setError('Sai username hoac password');
                } else if (!err.response) {
                    setError('Không kết nối được tới hệ thống Auth/Gateway. Vui lòng kiểm tra lại service.');
                } else {
                    setError('Đăng nhập thất bại, vui lòng thử lại.');
                }
            } else {
                setError('Đã xảy ra lỗi không xác định.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleQuickFill = (u: string, p: string) => {
        setUsername(u);
        setPassword(p);
        setError(null);
    };

    return (
        <div className="login-wrapper animate-fade-in">
            <div className="login-card">
                {/* Brand Header */}
                <div className="login-brand">
                    <div className="login-brand-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                        </svg>
                    </div>
                    <h2 className="login-title">Đăng nhập Hệ thống CRS</h2>
                    <p className="login-subtitle">Hệ thống Đăng ký Học phần Microservices</p>
                </div>

                {error && (
                    <div className="server-error-banner animate-fade-in" style={{ marginBottom: 16 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: 14 }}>
                        <label className="form-label">Tên đăng nhập</label>
                        <input
                            type="text"
                            className="form-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Ví dụ: admin hoặc student1"
                            autoFocus
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: 20 }}>
                        <label className="form-label">Mật khẩu</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nhập mật khẩu..."
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="btn-action btn-primary" 
                        disabled={submitting} 
                        style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '14px' }}
                    >
                        {submitting ? (
                            <>
                                <span className="spinner"></span>
                                <span>Đang xử lý...</span>
                            </>
                        ) : (
                            <span>Đăng nhập</span>
                        )}
                    </button>
                </form>

                {/* Quick Account Helper */}
                <div className="login-quick-accounts">
                    <div className="login-quick-title">Tài khoản mẫu để test nhanh:</div>
                    <div className="login-quick-chips">
                        <button 
                            type="button" 
                            className="quick-chip admin"
                            onClick={() => handleQuickFill('admin', 'admin123')}
                        >
                            👑 <strong>Admin</strong> (admin / admin123)
                        </button>
                        <button 
                            type="button" 
                            className="quick-chip student"
                            onClick={() => handleQuickFill('student1', 'student123')}
                        >
                            🎓 <strong>Sinh viên</strong> (student1 / student123)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
