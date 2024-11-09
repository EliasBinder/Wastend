import { apiInstance } from '.';

export function register(data: any) {
	return apiInstance.post('auth/register', data);
}

export function login(data: any) {
	return apiInstance.post('auth/login', data);
}
