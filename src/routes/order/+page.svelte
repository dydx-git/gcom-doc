<script lang="ts">
	import Orders from '$lib/content/order/Orders.svelte';
	import type { PageData } from './$types';

	export let orders: PageData;
</script>

<Orders />
