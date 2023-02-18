<script lang="ts">
	import Clients from '$lib/content/client/Clients.svelte';
	import type { ClientFormData } from '$lib/interfaces/form';
	import type { Snapshot } from './$types';

	let formData: ClientFormData;

	export const snapshot: Snapshot = {
		capture: () => formData,
		restore: (value) => (formData = value)
	};
</script>

<Clients description="" bind:formData />
