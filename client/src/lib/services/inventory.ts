import { apiInstance } from '.';

export function getInventory() {
	return apiInstance.get('inventory/items');
}

export function mergeItems(data: any) {
	return apiInstance.post('inventory/merge', data);
}
