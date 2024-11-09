<script>
	import TrashForm from '$lib/components/full-form/TrashForm.svelte';
	import { page } from '$app/stores';
</script>

<TrashForm findingId={$page.url.searchParams.get('finding_id') || undefined} />
