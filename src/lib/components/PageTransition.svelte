<script lang="ts">
	import { fly } from 'svelte/transition';
	export let pathname: string = '';
</script>

{#key pathname}
	<div in:fly="{{ x: -10, duration: 500, delay: 200 }}" out:fly="{{ x: 5, duration: 100 }}">
		<slot />
	</div>
{/key}
