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
        <div className="page-container animate-fade-in" style={{ maxWidth: 960, margin: '0 auto', paddingBottom: 48 }}>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Quản Lý API Key Đối Tác</h1>
                    <p className="page-subtitle">Cấp phát, phân quyền theo scope và thu hồi API Key dành cho các hệ thống tích hợp bên ngoài</p>
                </div>
            </div>

            {/* Form cap key moi */}
            <div className="card" style={{ marginBottom: 28, padding: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="7.5" cy="15.5" r="4.5"></circle>
                        <path d="m21 2-9.6 9.6"></path>
                        <path d="m15.5 7.5 3 3"></path>
                    </svg>
                    Cấp API Key mới
                </h3>
                <form onSubmit={handleCreate}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 16 }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#cbd5e1' }}>
                                Tên đối tác <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Ví dụ: Công ty ABC Edu"
                                value={ownerName}
                                onChange={(e) => setOwnerName(e.target.value)}
                                required
                                style={{ width: '100%', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#cbd5e1' }}>
                                Scopes (phân tách bởi dấu phẩy) <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="courses:read"
                                value={scopes}
                                onChange={(e) => setScopes(e.target.value)}
                                required
                                style={{ width: '100%', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#cbd5e1' }}>
                                Hiệu lực (số ngày, để trống = vĩnh viễn)
                            </label>
                            <input
                                type="number"
                                className="form-input"
                                placeholder="30"
                                min="1"
                                value={validDays}
                                onChange={(e) => setValidDays(e.target.value)}
                                style={{ width: '100%', boxSizing: 'border-box' }}
                            />
                        </div>
                    </div>

                    {error && (
                        <div style={{ color: '#f87171', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
                            {error}
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" className="btn-action btn-primary" disabled={submitting} style={{ padding: '9px 20px', fontSize: 14 }}>
                            {submitting ? 'Đang tạo...' : 'Cấp API Key'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Hop thong bao Key vua tao - chi hien thi 1 lan duy nhat */}
            {newKeyValue && (
                <div style={{
                    background: 'rgba(234, 179, 8, 0.12)',
                    border: '1px solid rgba(234, 179, 8, 0.4)',
                    padding: 18,
                    borderRadius: 10,
                    marginBottom: 28
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fde047', fontWeight: 700, fontSize: 14 }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            Key vừa tạo (chỉ hiển thị 1 lần duy nhất, hãy sao chép và lưu trữ an toàn ngay):
                        </div>
                        <button
                            type="button"
                            onClick={handleCopyKey}
                            className="btn-action"
                            style={{
                                background: copied ? '#15803d' : '#ca8a04',
                                color: '#fff',
                                padding: '5px 14px',
                                fontSize: 12,
                                border: 'none',
                                borderRadius: 6,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {copied ? '✓ Đã chép' : 'Sao chép Key'}
                        </button>
                    </div>
                    <pre style={{
                        background: '#091322',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        padding: '12px 16px',
                        borderRadius: 8,
                        color: '#38bdf8',
                        fontSize: 14,
                        fontFamily: 'monospace',
                        userSelect: 'all',
                        overflowX: 'auto',
                        margin: 0
                    }}>
                        {newKeyValue}
                    </pre>
                </div>
            )}

            {/* Danh sach API Key */}
            <div className="card" style={{ padding: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="8" y1="6" x2="21" y2="6"></line>
                        <line x1="8" y1="12" x2="21" y2="12"></line>
                        <line x1="8" y1="18" x2="21" y2="18"></line>
                        <line x1="3" y1="6" x2="3.01" y2="6"></line>
                        <line x1="3" y1="12" x2="3.01" y2="12"></line>
                        <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                    Danh sách API Key đối tác
                </h3>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '32px 0', color: '#94a3b8' }}>
                        Đang tải danh sách API Key...
                    </div>
                ) : keys.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '32px 0', color: '#94a3b8' }}>
                        Chưa có API Key nào được cấp.
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '2px solid #334155', color: '#94a3b8', fontSize: 13 }}>
                                    <th style={{ padding: '12px 10px' }}>Đối tác</th>
                                    <th style={{ padding: '12px 10px' }}>Scopes</th>
                                    <th style={{ padding: '12px 10px' }}>Trạng thái</th>
                                    <th style={{ padding: '12px 10px' }}>Hạn sử dụng</th>
                                    <th style={{ padding: '12px 10px', textAlign: 'right' }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {keys.map((k) => (
                                    <tr key={k.id} style={{ borderBottom: '1px solid #1e293b' }}>
                                        <td style={{ padding: '14px 10px', fontWeight: 600, color: '#f1f5f9' }}>
                                            {k.ownerName}
                                        </td>
                                        <td style={{ padding: '14px 10px' }}>
                                            <span style={{
                                                background: 'rgba(56, 189, 248, 0.12)',
                                                color: '#38bdf8',
                                                padding: '3px 8px',
                                                borderRadius: 4,
                                                fontSize: 12,
                                                fontFamily: 'monospace'
                                            }}>
                                                {k.scopes}
                                            </span>
                                        </td>
                                        <td style={{ padding: '14px 10px' }}>
                                            <span className={`badge ${k.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`} style={{
                                                background: k.status === 'ACTIVE' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                                color: k.status === 'ACTIVE' ? '#4ade80' : '#f87171',
                                                border: `1px solid ${k.status === 'ACTIVE' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                                                padding: '2px 8px',
                                                borderRadius: 6,
                                                fontSize: 11,
                                                fontWeight: 700
                                            }}>
                                                {k.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '14px 10px', color: '#94a3b8' }}>
                                            {k.expiresAt ? new Date(k.expiresAt).toLocaleDateString('vi-VN') : 'Vĩnh viễn'}
                                        </td>
                                        <td style={{ padding: '14px 10px', textAlign: 'right' }}>
                                            {k.status === 'ACTIVE' ? (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRevoke(k)}
                                                    className="btn-action"
                                                    style={{
                                                        background: 'rgba(239, 68, 68, 0.15)',
                                                        color: '#f87171',
                                                        border: '1px solid rgba(239, 68, 68, 0.4)',
                                                        padding: '4px 12px',
                                                        fontSize: 12,
                                                        borderRadius: 6,
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Thu hồi
                                                </button>
                                            ) : (
                                                <span style={{ color: '#64748b', fontSize: 12 }}>Đã thu hồi</span>
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
