<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { apiUrl } from '$lib/services';
	import { getFindings } from '$lib/services/finding';

	let finding;
	onMount(() => {
		const id = $page.params.id;
		getFindings().then((response) => {
			finding = response.data.find((f) => f.id === id);
		});
	});
</script>

<div class="relative h-full">
	<img
		src={`${apiUrl}report/findings/${$page.params.id}/image`}
		class="w-full h-full object-cover"
	/>
	<a
		href="/form?finding_id={$page.params.id}"
		class="btn variant-filled absolute left-10 right-10 bottom-10"
	>
		Resolve this
	</a>
</div>
