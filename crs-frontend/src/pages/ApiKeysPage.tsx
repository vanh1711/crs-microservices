import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { getApiKeys, createApiKey, revokeApiKey } from '../api/apiKeyApi';
import type { ApiKey } from '../types/apiKey';
import type { ApiErrorResponse } from '../types/apiError';

export default function ApiKeysPage() {
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [ownerName, setOwnerName] = useState('');
    const [scopes, setScopes] = useState('courses:read');
    const [validDays, setValidDays] = useState('30');
    const [newKeyValue, setNewKeyValue] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const loadKeys = useCallback(() => {
        setLoading(true);
        getApiKeys()
            .then((res) => {
                setKeys(res.data);
                setError(null);
            })
            .catch(() => setError('Không thể tải danh sách API Key.'))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        loadKeys();
    }, [loadKeys]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setNewKeyValue(null);
        setCopied(false);
        setSubmitting(true);
        try {
            const res = await createApiKey({
                ownerName: ownerName.trim(),
                scopes: scopes.trim(),
                validDays: validDays ? Number(validDays) : undefined,
            });
            setNewKeyValue(res.data.keyValue); // Chi hien thi 1 lan duy nhat cho Admin
            setOwnerName('');
            loadKeys();
        } catch (err) {
            if (axios.isAxiosError<ApiErrorResponse>(err) && err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Cấp API Key không thành công. Vui lòng kiểm tra lại quyền hạn.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleRevoke = async (key: ApiKey) => {
        if (!window.confirm(`Xác nhận thu hồi API Key của đối tác "${key.ownerName}"? Thao tác này không thể hoàn tác.`)) {
            return;
        }
        try {
            await revokeApiKey(key.id);
            loadKeys();
        } catch {
            alert('Thu hồi API Key không thành công.');
        }
    };

    const handleCopyKey = () => {
        if (!newKeyValue) return;
        navigator.clipboard.writeText(newKeyValue).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        });
    };

    return (
        <div className="page-container animate-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Quản Lý API Key Đối Tác</h1>
                    <p className="page-subtitle">Cấp phát, phân quyền theo scope và thu hồi API Key cho các hệ thống tích hợp bên ngoài</p>
                </div>
            </div>

            {/* Form cap key moi */}
            <div className="form-card animate-fade-in">
                <div className="form-header">
                    <div className="form-header-title">
                        <div className="form-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="7.5" cy="15.5" r="4.5"></circle>
                                <path d="m21 2-9.6 9.6"></path>
                                <path d="m15.5 7.5 3 3"></path>
                            </svg>
                        </div>
                        <div>
                            <h2 className="form-title">Cấp API Key mới</h2>
                            <p className="form-subtitle">Điền thông tin đối tác và phạm vi quyền truy cập để phát hành mã khóa</p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="server-error-banner animate-fade-in" style={{ marginBottom: 16 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleCreate}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">
                                Tên đối tác <span className="required-star">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Ví dụ: Công ty ABC Edu"
                                value={ownerName}
                                onChange={(e) => setOwnerName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                Scopes (phân tách bởi dấu phẩy) <span className="required-star">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="courses:read"
                                value={scopes}
                                onChange={(e) => setScopes(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                Hiệu lực (số ngày, để trống = vĩnh viễn)
                            </label>
                            <input
                                type="number"
                                className="form-input"
                                placeholder="30"
                                min="1"
                                value={validDays}
                                onChange={(e) => setValidDays(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-actions" style={{ marginTop: 18 }}>
                        <button type="submit" className="btn-action btn-primary" disabled={submitting}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                <circle cx="7.5" cy="15.5" r="4.5"></circle>
                                <path d="m21 2-9.6 9.6"></path>
                            </svg>
                            <span>{submitting ? 'Đang cấp...' : 'Cấp API Key'}</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Hop thong bao Key vua tao - chi hien thi 1 lan duy nhat */}
            {newKeyValue && (
                <div className="animate-fade-in" style={{
                    background: '#fefce8',
                    border: '1.5px solid #facc15',
                    borderRadius: 'var(--radius-lg)',
                    padding: '20px 24px',
                    marginBottom: 24,
                    boxShadow: '0 4px 12px rgba(234, 179, 8, 0.15)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#854d0e', fontWeight: 700, fontSize: 14 }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ca8a04" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            Key vừa tạo (chỉ hiển thị 1 lần duy nhất, hãy sao chép và lưu trữ ngay):
                        </div>
                        <button
                            type="button"
                            onClick={handleCopyKey}
                            className="btn-action"
                            style={{
                                background: copied ? 'var(--teal-600)' : '#eab308',
                                color: '#ffffff',
                                border: 'none',
                                padding: '6px 16px',
                                fontSize: 13,
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                transition: 'all 0.2s'
                            }}
                        >
                            {copied ? '✓ Đã sao chép' : 'Sao chép Key'}
                        </button>
                    </div>
                    <pre style={{
                        background: 'var(--navy-900)',
                        border: '1px solid var(--navy-700)',
                        padding: '14px 18px',
                        borderRadius: 'var(--radius-md)',
                        color: '#38bdf8',
                        fontSize: 14,
                        fontFamily: 'var(--font-mono)',
                        userSelect: 'all',
                        overflowX: 'auto',
                        margin: 0,
                        letterSpacing: '0.5px'
                    }}>
                        {newKeyValue}
                    </pre>
                </div>
            )}

            {/* Danh sach API Key */}
            <div className="table-card animate-fade-in">
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="form-icon" style={{ width: 34, height: 34 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="8" y1="6" x2="21" y2="6"></line>
                            <line x1="8" y1="12" x2="21" y2="12"></line>
                            <line x1="8" y1="18" x2="21" y2="18"></line>
                            <line x1="3" y1="6" x2="3.01" y2="6"></line>
                            <line x1="3" y1="12" x2="3.01" y2="12"></line>
                            <line x1="3" y1="18" x2="3.01" y2="18"></line>
                        </svg>
                    </div>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--navy-900)' }}>
                        Danh sách API Key đối tác
                    </h3>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                        Đang tải danh sách API Key...
                    </div>
                ) : keys.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                        Chưa có API Key nào được cấp trong hệ thống.
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Đối tác</th>
                                    <th>Scopes</th>
                                    <th style={{ textAlign: 'center' }}>Trạng thái</th>
                                    <th>Hạn sử dụng</th>
                                    <th style={{ textAlign: 'right' }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {keys.map((k) => (
                                    <tr key={k.id}>
                                        <td style={{ fontWeight: 700, color: 'var(--navy-900)' }}>
                                            {k.ownerName}
                                        </td>
                                        <td>
                                            <span style={{
                                                background: 'var(--teal-50)',
                                                color: 'var(--teal-800)',
                                                border: '1px solid var(--teal-200)',
                                                padding: '3px 10px',
                                                borderRadius: 6,
                                                fontSize: 12,
                                                fontWeight: 600,
                                                fontFamily: 'var(--font-mono)'
                                            }}>
                                                {k.scopes}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span className={`badge ${k.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
                                                {k.status}
                                            </span>
                                        </td>
                                        <td style={{ color: 'var(--text-muted)' }}>
                                            {k.expiresAt ? new Date(k.expiresAt).toLocaleDateString('vi-VN') : 'Vĩnh viễn'}
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            {k.status === 'ACTIVE' ? (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRevoke(k)}
                                                    className="btn-action btn-danger"
                                                    style={{ padding: '6px 14px', fontSize: 12 }}
                                                >
                                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                                        <circle cx="12" cy="12" r="10"></circle>
                                                        <line x1="15" y1="9" x2="9" y2="15"></line>
                                                        <line x1="9" y1="9" x2="15" y2="15"></line>
                                                    </svg>
                                                    <span>Thu hồi</span>
                                                </button>
                                            ) : (
                                                <span style={{ color: 'var(--text-subtle)', fontSize: 13, fontStyle: 'italic' }}>
                                                    Đã thu hồi
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
