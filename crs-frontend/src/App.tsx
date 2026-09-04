import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import CoursesPage from './pages/CoursesPage';
import AdminCoursesPage from './pages/AdminCoursesPage';
import ApiKeysPage from './pages/ApiKeysPage';
import RegisterCoursePage from './pages/RegisterCoursePage';
import MyRegistrationsPage from './pages/MyRegistrationsPage';
import Navbar from './components/Navbar';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <div className="app-layout">
                    <Navbar />
                    <main className="app-main-content">
                        <Routes>
                            <Route path="/" element={<Navigate to="/courses" replace />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/courses" element={<CoursesPage />} />
                            <Route
                                path="/admin/courses"
                                element={
                                    <ProtectedRoute requiredRole="ADMIN">
                                        <AdminCoursesPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/api-keys"
                                element={
                                    <ProtectedRoute requiredRole="ADMIN">
                                        <ApiKeysPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/register-course"
                                element={
                                    <ProtectedRoute requiredRole="STUDENT">
                                        <RegisterCoursePage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/my-registrations"
                                element={
                                    <ProtectedRoute requiredRole="STUDENT">
                                        <MyRegistrationsPage />
                                    </ProtectedRoute>
                                }
                            />
                            {/* Catch-all: Tự động điều hướng mọi đường dẫn không tồn tại về /courses */}
                            <Route path="*" element={<Navigate to="/courses" replace />} />
                        </Routes>
                    </main>
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;