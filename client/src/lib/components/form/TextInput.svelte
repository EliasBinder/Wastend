<script lang="ts">
	export let value = '';
	export let error = '';
	export let label = '';
	export let type = 'text';
</script>

<label class="label">
	<span>{label}</span>
	<input class="input" bind:value {...{ type }} />
	{#if error}
		<p class="text-red-500">{error}</p>
	{/if}
</label>
