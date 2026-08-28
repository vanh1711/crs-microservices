import { useState } from 'react';
import { useCourses } from './api/useCourses';
import SearchBox from './components/SearchBox';
import CourseList from './components/CourseList';
import Pagination from './components/Pagination';

function App() {
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(0);
    const { courses, totalPages, state, errorMessage, refetch } = useCourses(keyword, page);

    const handleSearch = (newKeyword: string) => {
        setKeyword(newKeyword);
        setPage(0); // Mỗi lần tìm kiếm mới, luôn quay về trang đầu
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
                            <h1 className="brand-title">Cổng Đăng Ký Học Phần (CRS)</h1>
                            <p className="brand-subtitle">Course Registration Microservices System</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <div className="header-badge">
                            <span className="status-dot"></span>
                            <span>Gateway :8080</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Search Box */}
            <SearchBox 
                onSearch={handleSearch} 
                totalResults={state === 'success' ? courses.length : undefined} 
            />

            {/* Course List / Data Table */}
            <CourseList
                courses={courses}
                state={state}
                errorMessage={errorMessage}
                onRetry={refetch}
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