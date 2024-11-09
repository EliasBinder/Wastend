import { browser } from '$app/environment';
import axios from 'axios';

export const apiUrl = 'http://10.11.120.30:3045/';

const getAccessToken = () => {
	const user = browser ? localStorage.getItem('user') : null;
	if (user) {
		const userData = JSON.parse(user);
		return userData.sessionId;
	}
	return '';
};

export const apiInstance = axios.create({
	baseURL: apiUrl,
	headers: {
		Authorization: `Bearer ${getAccessToken()}`
	}
});
