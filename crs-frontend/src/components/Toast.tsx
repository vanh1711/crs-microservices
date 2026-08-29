import { useEffect } from 'react';

interface ToastProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3500);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`toast-container animate-slide-up toast-${type}`}>
            <div className="toast-icon">
                {type === 'success' ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                )}
            </div>
            <span className="toast-message">{message}</span>
            <button type="button" onClick={onClose} className="toast-close-btn" title="Đóng thông báo">
                ✕
            </button>
        </div>
    );
}
