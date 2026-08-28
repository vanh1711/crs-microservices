import { useState, useCallback } from 'react';
import axios from 'axios';
import { useCourses } from '../api/useCourses';
import { createCourse, updateCourse, deleteCourse } from '../api/courseApi';
import SearchBox from '../components/SearchBox';
import CourseList from '../components/CourseList';
import Pagination from '../components/Pagination';
import CourseForm from '../components/CourseForm';
import type { Course, CourseFormValues } from '../types/course';
import type { ApiErrorResponse } from '../types/apiError';

export default function AdminCoursesPage() {
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
            if (data && typeof data === 'object') {
                const firstFieldError = Object.values(data).find((v) => typeof v === 'string');
                if (firstFieldError) return firstFieldError as string;
            }
            if (err.response?.status === 403 || err.response?.status === 401) {
                return 'Bạn không có quyền thực hiện thao tác này hoặc phiên đăng nhập đã hết hạn.';
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
            refetch();
        } catch (err) {
            setFormError(extractErrorMessage(err));
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (course: Course) => {
        if (!window.confirm(`Xóa môn học "${course.tenMonHoc}"?`)) return;
        try {
            await deleteCourse(course.id);
            refetch();
        } catch (err) {
            alert(extractErrorMessage(err));
        }
    };

    return (
        <div className="page-container animate-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Quản Trị Môn Học (Admin)</h1>
                    <p className="page-subtitle">Thêm mới, điều chỉnh thông tin hoặc xóa học phần trong chương trình đào tạo</p>
                </div>
            </div>

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
                    onEdit={(course) => {
                        setEditingCourse(course);
                        setFormError(null);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onDelete={handleDelete}
                />
            </div>

            <Pagination 
                currentPage={page} 
                totalPages={totalPages} 
                onPageChange={setPage} 
            />
        </div>
    );
}
