import { apiInstance } from '.';

export function createFinding(data: any) {
	const formData = new FormData();
	Object.entries(data).forEach(([key, value]) => {
		formData.append(key, value);
	});
	return apiInstance.post('report/findings', formData);
}
export function resolveFinding(data: any, findingId?: string) {
	const formData = new FormData();
	Object.entries(data).forEach(([key, value]) => {
		formData.append(key, value);
	});
	if (findingId) {
		formData.append('findingId', findingId);
	}
	return apiInstance.post('report/resolves', formData);
}

export function getFindings() {
	return apiInstance.get('report/findings?resolved=false');
}

export function getResolves() {
	return apiInstance.get('report/resolves');
}
