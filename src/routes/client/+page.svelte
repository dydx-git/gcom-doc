<script lang="ts">
	import Clients from '$lib/content/client/Clients.svelte';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;
</script>

<Clients description="" bind:form />
