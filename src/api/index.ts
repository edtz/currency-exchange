import Axios from 'axios';

export const client = {
    get<T>(url: string, params: {} = {}) {
        return Axios.get<T & { success: boolean }>(url, {
            params: { ...params, access_key: process.env.REACT_APP_API_TOKEN },
        }).then(({ data: { success, ...datum }, request }) => {
            if (success) return datum;
            return Promise.reject(request);
        });
    },
};
