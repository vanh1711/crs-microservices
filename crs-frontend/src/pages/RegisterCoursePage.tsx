import { useState, useCallback } from 'react';
import axios from 'axios';
import { useCourses } from '../api/useCourses';
import { registerCourse } from '../api/registrationApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import SearchBox from '../components/SearchBox';
import CourseList from '../components/CourseList';
import Pagination from '../components/Pagination';
import Toast from '../components/Toast';
import type { Course } from '../types/course';
import type { ApiErrorResponse } from '../types/apiError';

export default function RegisterCoursePage() {
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(0);
    const [registeringId, setRegisteringId] = useState<number | null>(null);

    const { user } = useAuth();
    const { toast, showToast, clearToast } = useToast();
    const { courses, totalPages, state, errorMessage, refetch } = useCourses(keyword, page);

    const handleSearch = useCallback((newKeyword: string) => {
        setKeyword((prevKeyword) => {
            if (prevKeyword !== newKeyword) {
                setPage(0);
                return newKeyword;
            }
            return prevKeyword;
        });
    }, []);

    const handleRegister = async (course: Course) => {
        if (!user) return;
        setRegisteringId(course.id);
        try {
            await registerCourse({ studentId: user.id, courseId: course.id });
            showToast(`Đăng ký thành công môn "${course.tenMonHoc}"`, 'success');
            refetch(); // Tải lại danh sách để cập nhật số chỗ còn lại mới nhất
        } catch (err) {
            // Lỗi có thể từ registration-service ("Sinh vien da dang ky...")
            // hoặc lan truyền từ course-service ("Mon hoc da het cho...")
            let message = 'Đăng ký không thành công, vui lòng thử lại.';
            if (axios.isAxiosError<ApiErrorResponse>(err) && err.response?.data?.message) {
                message = err.response.data.message;
            } else if (axios.isAxiosError(err) && err.response?.status === 403) {
                message = 'Bạn không có quyền thực hiện đăng ký (cần tài khoản STUDENT).';
            }
            showToast(message, 'error');
        } finally {
            setRegisteringId(null);
        }
    };

    return (
        <div className="page-container animate-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Đăng Ký Học Phần</h1>
                    <p className="page-subtitle">Chọn học phần trong danh sách để đăng ký tham gia lớp học</p>
                </div>
                {user && (
                    <div className="badge badge-success" style={{ padding: '6px 14px', fontSize: '13px' }}>
                        🎓 Sinh viên: <strong>{user.username}</strong> (ID: #{user.id})
                    </div>
                )}
            </div>

            <SearchBox 
                onSearch={handleSearch} 
                totalResults={state === 'success' ? courses.length : undefined} 
            />

            <div style={{ marginTop: 16 }}>
                <CourseList
                    courses={courses}
                    state={state}
                    errorMessage={errorMessage}
                    onRetry={refetch}
                    onRegister={handleRegister}
                    registeringId={registeringId}
                />
            </div>

            <Pagination 
                currentPage={page} 
                totalPages={totalPages} 
                onPageChange={setPage} 
            />

            {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}
        </div>
    );
}
