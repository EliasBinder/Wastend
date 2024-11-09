<script lang="ts">
	import { createFinding, resolveFinding } from '$lib/services/finding';
	import { createEventDispatcher } from 'svelte';
	import PageContainer from '$lib/components/layout/PageContainer.svelte';
	import PhotoInput from '../form/PhotoInput.svelte';
	import { goto } from '$app/navigation';

	export let findingId: string | undefined = undefined;
	let trashImage: File;
	let resolving = false;

	function submitFinding() {
		navigator.geolocation.getCurrentPosition((position) => {
			createFinding({
				image: trashImage,
				latitude: position.coords.latitude,
				longitude: position.coords.longitude
			}).then((response) => {
				goto('/');
			});
		});
	}
	function submitResolution(event) {
		const trashImageRemoved = event.detail.photo;
		navigator.geolocation.getCurrentPosition((position) => {
			resolveFinding(
				{
					imageTrash: trashImage,
					imageNoTrash: trashImageRemoved,
					latitude: position.coords.latitude,
					longitude: position.coords.longitude
				},
				findingId
			).then((response) => {
				goto('/');
			});
		});
	}
</script>

<div class="flex flex-col h-full">
	{#if !trashImage}
		<PhotoInput on:photoCaptured={(event) => (trashImage = event.detail.photo)} />
	{:else if trashImage && !resolving}
		<PageContainer>
			{#if !findingId}
				<button
					class="bg-primary-600 font-bold text-white rounded-lg text-xl grow flex flex-col items-center justify-center gap-6"
					on:click={submitFinding}
				>
					<div class="text-6xl">📤</div>
					Submit Finding
				</button>
			{/if}
			<button
				class="bg-primary-800 font-bold text-white rounded-lg grow text-xl flex flex-col items-center justify-center gap-6"
				on:click={() => {
					resolving = true;
				}}
			>
				<div class="text-6xl">🚮</div>
				Resolve Finding
			</button>
		</PageContainer>
	{:else if trashImage && resolving}
		<PhotoInput on:photoCaptured={submitResolution} />
	{/if}
</div>
