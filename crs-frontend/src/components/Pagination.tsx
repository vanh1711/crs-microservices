interface PaginationProps {
    currentPage: number; // bat dau tu 0, dung dinh dang giong Spring Data Pageable
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i);

    return (
        <div className="pagination-wrapper animate-fade-in">
            <div className="pagination-info">
                Trang <strong>{currentPage + 1}</strong> trên tổng số <strong>{totalPages}</strong> trang
            </div>

            <div className="pagination-controls">
                <button
                    type="button"
                    className="page-btn"
                    disabled={currentPage === 0}
                    onClick={() => onPageChange(currentPage - 1)}
                    title="Trang trước"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>

                {pages.map((p) => (
                    <button
                        key={p}
                        type="button"
                        className={`page-btn ${p === currentPage ? 'active' : ''}`}
                        onClick={() => onPageChange(p)}
                    >
                        {p + 1}
                    </button>
                ))}

                <button
                    type="button"
                    className="page-btn"
                    disabled={currentPage >= totalPages - 1}
                    onClick={() => onPageChange(currentPage + 1)}
                    title="Trang sau"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            </div>
        </div>
    );
}
