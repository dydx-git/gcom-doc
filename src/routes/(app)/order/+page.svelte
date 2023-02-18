<script lang="ts">
	import Orders from '$lib/content/order/Orders.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const orders = data.orders;
</script>

<Orders tableData={orders} />
