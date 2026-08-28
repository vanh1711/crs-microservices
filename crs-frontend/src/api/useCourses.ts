import { useState, useEffect, useCallback } from 'react';
import { getCourses } from './courseApi';
import type { Course } from '../types/course';
import type { ApiErrorResponse } from '../types/apiError';
import axios from 'axios';

export type LoadState = 'loading' | 'success' | 'empty' | 'error';

// size = 5 de hien thi nhieu mon hoc tren 1 trang hon
export function useCourses(keyword: string, page: number, size = 5) {
    const [courses, setCourses] = useState<Course[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [state, setState] = useState<LoadState>('loading');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const fetchCourses = useCallback(() => {
        setState('loading');

        // Delay 1.2 giay de kip quan sat va chup anh man hinh loading
        const timer = setTimeout(() => {
            getCourses(keyword, page, size)
                .then((res) => {
                    const data = res.data;
                    setCourses(data.content);
                    setTotalPages(data.totalPages);
                    setState(data.content.length === 0 ? 'empty' : 'success');
                })
                .catch((err) => {
                    let message = 'Da xay ra loi khong xac dinh, vui long thu lai.';
                    if (axios.isAxiosError<ApiErrorResponse>(err)) {
                        if (err.response?.data?.message) {
                            message = err.response.data.message;
                        } else if (!err.response) {
                            // Khong nhan duoc response nao ca - Gateway hoac course-service dang tat
                            message = 'Khong ket noi duoc toi he thong. Vui long thu lai sau.';
                        }
                    }
                    setErrorMessage(message);
                    setState('error');
                });
        }, 1200);

        return () => clearTimeout(timer);
    }, [keyword, page, size]);

    useEffect(() => {
        const cleanup = fetchCourses();
        return cleanup;
    }, [fetchCourses]);

    return { courses, totalPages, state, errorMessage, refetch: fetchCourses };
}
