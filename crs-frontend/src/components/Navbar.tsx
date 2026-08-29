import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="main-navbar">
            <div className="nav-container">
                {/* Brand Logo */}
                <Link to="/courses" className="nav-brand">
                    <div className="nav-brand-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                        </svg>
                    </div>
                    <span className="nav-brand-text">CRS Portal</span>
                </Link>

                {/* Main Links */}
                <div className="nav-links">
                    <Link 
                        to="/courses" 
                        className={`nav-link ${isActive('/courses') ? 'active' : ''}`}
                    >
                        Danh sách môn học
                    </Link>

                    {isAuthenticated && user?.role === 'ADMIN' && (
                        <Link 
                            to="/admin/courses" 
                            className={`nav-link ${isActive('/admin/courses') ? 'active' : ''}`}
                        >
                            Quản trị môn học
                        </Link>
                    )}

                    {isAuthenticated && user?.role === 'STUDENT' && (
                        <>
                            <Link 
                                to="/register-course" 
                                className={`nav-link ${isActive('/register-course') ? 'active' : ''}`}
                            >
                                Đăng ký học phần
                            </Link>
                            <Link 
                                to="/my-registrations" 
                                className={`nav-link ${isActive('/my-registrations') ? 'active' : ''}`}
                            >
                                Môn học đã đăng ký
                            </Link>
                        </>
                    )}
                </div>

                {/* Right Auth Section */}
                <div className="nav-auth-section">
                    {isAuthenticated && user ? (
                        <div className="nav-user-profile">
                            <div className="nav-user-info">
                                <span className="nav-username">{user.username}</span>
                                <span className={`badge ${user.role === 'ADMIN' ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: '10px', padding: '2px 7px' }}>
                                    {user.role}
                                </span>
                            </div>
                            <button type="button" className="btn-logout" onClick={handleLogout} title="Đăng xuất khỏi hệ thống">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                    <polyline points="16 17 21 12 16 7"></polyline>
                                    <line x1="21" y1="12" x2="9" y2="12"></line>
                                </svg>
                                <span>Đăng xuất</span>
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn-action btn-primary" style={{ padding: '7px 16px', fontSize: '13px', textDecoration: 'none' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                                <polyline points="10 17 15 12 10 7"></polyline>
                                <line x1="15" y1="12" x2="3" y2="12"></line>
                            </svg>
                            <span>Đăng nhập</span>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
