import { useState, useEffect, useRef } from 'react';

interface SearchBoxProps {
    onSearch: (keyword: string) => void;
    placeholder?: string;
    totalResults?: number;
}

export default function SearchBox({ onSearch, placeholder, totalResults }: SearchBoxProps) {
    const [inputValue, setInputValue] = useState('');
    const isFirstRender = useRef(true);

    useEffect(() => {
        // Tránh gọi onSearch khi component vừa mount lần đầu
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            onSearch(inputValue.trim());
        }, 400);

        return () => clearTimeout(timer);
    }, [inputValue, onSearch]);

    const handleClear = () => {
        setInputValue('');
    };

    return (
        <div className="search-card">
            <div className="search-input-wrapper">
                <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                    type="text"
                    className="search-input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={placeholder ?? 'Tìm kiếm theo tên môn học (ví dụ: Lập trình, Cơ sở dữ liệu...)'}
                />
                {inputValue && (
                    <button 
                        type="button" 
                        className="search-clear-btn" 
                        onClick={handleClear}
                        title="Xóa tìm kiếm"
                    >
                        ✕
                    </button>
                )}
            </div>

            {totalResults !== undefined && (
                <div className="search-stats">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                    <span>{totalResults} môn học / trang</span>
                </div>
            )}
        </div>
    );
}
