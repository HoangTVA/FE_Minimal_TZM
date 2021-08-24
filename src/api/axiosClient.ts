// api/axiosClient.js
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import queryString from 'query-string';
// Set up default config for http requests here



const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://stg-api.tradezonemap.com/api/v1.0',
    headers: {
        'content-type': 'multipart/form-data',
    },
    paramsSerializer: params => queryString.stringify(params),
});
axiosClient.interceptors.request.use(async (config: AxiosRequestConfig) => {
    const { method } = config;
    if (method === 'put' || method === 'post') {
        config.headers = {
            'content-type': 'application/json',
        }
    }
    var jwt = localStorage.getItem('access_token');
    if (jwt) {
        var exp = Number(localStorage.getItem('time_expire'));
        if (exp < Date.now() / 1000) {

            localStorage.removeItem("access_token");
            localStorage.removeItem("user");
            localStorage.removeItem("time_expire");
            // eslint-disable-next-line no-restricted-globals
            location.href = '/login';
        }
        config.headers.common = { 'Authorization': `Bearer ${jwt}` }

    }
    return config;
})
axiosClient.interceptors.response.use((response: AxiosResponse) => {
    if (response && response.data) {
        return response.data;
    }
    if (typeof (response.data) === 'boolean') {
        return response.data;
    }
    return response;
}, (error) => {
    // Handle errors
    throw error;
});
export default axiosClient;