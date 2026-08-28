import { useState, useCallback } from 'react';
import { useCourses } from '../api/useCourses';
import SearchBox from '../components/SearchBox';
import CourseList from '../components/CourseList';
import Pagination from '../components/Pagination';

export default function CoursesPage() {
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(0);
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

    return (
        <div className="page-container animate-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Danh Sách Môn Học</h1>
                    <p className="page-subtitle">Xem thông tin các học phần và số lượng chỗ còn trống trong học kỳ</p>
                </div>
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
