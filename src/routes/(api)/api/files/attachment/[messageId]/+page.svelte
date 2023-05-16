<script>
	export let data;
	const image = data.data;

	const filenameSplits = data.filename.split('###');
	const title = filenameSplits.length > 1 ? filenameSplits[1] : 'Image';
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>
<img src="{image}" alt="" />
