<script lang="ts">
	import Orders from '$lib/content/order/Orders.svelte';
	import type { PageData } from './$types';
	import type { Order } from '$lib/models/job';

	export let data: PageData;

	const orders = data.orders;
</script>

<Orders tableData={orders} />
