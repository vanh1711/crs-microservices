import { useState, useCallback } from 'react';
import axios from 'axios';
import { useCourses } from './api/useCourses';
import { createCourse, updateCourse, deleteCourse } from './api/courseApi';
import SearchBox from './components/SearchBox';
import CourseList from './components/CourseList';
import Pagination from './components/Pagination';
import CourseForm from './components/CourseForm';
import type { Course, CourseFormValues } from './types/course';
import type { ApiErrorResponse } from './types/apiError';

function App() {
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(0);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

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

    const extractErrorMessage = (err: unknown): string => {
        if (axios.isAxiosError<ApiErrorResponse>(err)) {
            const data = err.response?.data;
            if (data?.message) return data.message;
            // Trường hợp lỗi validation server trả về dạng { tenMonHoc: "...", soTinChi: "..." }
            if (data && typeof data === 'object') {
                const firstFieldError = Object.values(data).find((v) => typeof v === 'string');
                if (firstFieldError) return firstFieldError as string;
            }
            if (err.response?.status === 403 || err.response?.status === 401) {
                return 'Bạn không có quyền thực hiện thao tác này hoặc Token đã hết hạn. Hãy kiểm tra crs_token trong localStorage.';
            }
            if (!err.response) {
                return 'Không kết nối được tới hệ thống Gateway/Service.';
            }
        }
        return 'Đã xảy ra lỗi, vui lòng thử lại.';
    };

    const handleFormSubmit = async (values: CourseFormValues) => {
        setSubmitting(true);
        setFormError(null);
        try {
            if (editingCourse) {
                await updateCourse(editingCourse.id, values);
            } else {
                await createCourse(values);
            }
            setEditingCourse(null);
            refetch(); // đồng bộ lại danh sách ngay sau khi lưu thành công
        } catch (err) {
            setFormError(extractErrorMessage(err));
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (course: Course) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa môn học "${course.tenMonHoc}"?`)) return;
        try {
            await deleteCourse(course.id);
            refetch(); // đồng bộ lại danh sách ngay sau khi xóa thành công
        } catch (err) {
            alert(extractErrorMessage(err));
        }
    };

    return (
        <div className="app-container">
            {/* Header / Brand */}
            <header className="app-header">
                <div className="header-top">
                    <div className="brand">
                        <div className="brand-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                            </svg>
                        </div>
                        <div>
                            <h1 className="brand-title">Quản Lý Môn Học (Admin)</h1>
                            <p className="brand-subtitle">Course Registration Microservices System • Buổi 7 CRUD Form</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <div className="header-badge">
                            <span className="status-dot"></span>
                            <span>Gateway :8080</span>
                        </div>
                        <div className="header-badge" style={{ background: '#fef3c7', borderColor: '#fde68a', color: '#b45309' }}>
                            <span>ROLE_ADMIN</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Course Form (Thêm / Sửa) */}
            <CourseForm
                editingCourse={editingCourse}
                onSubmit={handleFormSubmit}
                onCancel={() => {
                    setEditingCourse(null);
                    setFormError(null);
                }}
                submitting={submitting}
                serverError={formError}
            />

            {/* Search Box */}
            <SearchBox 
                onSearch={handleSearch} 
                totalResults={state === 'success' ? courses.length : undefined} 
            />

            {/* Course List / Data Table with Edit/Delete */}
            <CourseList
                courses={courses}
                state={state}
                errorMessage={errorMessage}
                onRetry={refetch}
                onEdit={(course) => {
                    setEditingCourse(course);
                    setFormError(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onDelete={handleDelete}
            />

            {/* Pagination */}
            <Pagination 
                currentPage={page} 
                totalPages={totalPages} 
                onPageChange={setPage} 
            />
        </div>
    );
}

export default App;