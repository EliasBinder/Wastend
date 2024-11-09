import { writable } from 'svelte/store';
import { browser } from '$app/environment';
export const userData = writable<any | null>(null);

export const setUserData = (data: any) => {
	localStorage.setItem('user', JSON.stringify(data));
	userData.update(() => data);
};

export const clearUserToken = () => {
	userData.set(null);
	if (browser) {
		localStorage.removeItem('token');
		window.location.href = '/login';
	}
};

export const loadUserData = () => {
	const data = localStorage.getItem('user');
	if (data) {
		userData.set(JSON.parse(data));
	}
};
