<script>
	import { page } from '$app/stores';
	const error = $page.error;

	console.log(error);
</script>

<h1>{error?.message ?? error?.messages}</h1>
