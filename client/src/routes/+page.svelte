<script>
	import LoginForm from '$lib/components/full-form/LoginForm.svelte';
	import { userData } from '$lib/auth';
	import TrashMap from '$lib/components/molecules/TrashMap.svelte';
</script>

{#if !$userData}
	<LoginForm />
{:else}
	<TrashMap />
{/if}
