import { apiInstance } from '.';

export function getInventory() {
	return apiInstance.get('inventory/items');
}
