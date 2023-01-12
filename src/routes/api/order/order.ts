import type { Design } from '$lib/models/order';

class Order {
	design: Design | null;

	constructor() {
		this.design = null;
	}
}
