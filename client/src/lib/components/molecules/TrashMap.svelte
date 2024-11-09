<script lang="ts">
	import { onMount } from 'svelte';
	import { MapLibre, Marker } from 'svelte-maplibre';
	import TrashForm from '../full-form/TrashForm.svelte';
	import { getFindings, getResolves } from '$lib/services/finding';
	import { goto } from '$app/navigation';
	let currentPosition: GeolocationPosition;
	let initialPosition: GeolocationPosition;
	let logging = false;
	let findings = [];
	let resolves = [];
	onMount(() => {
		navigator.geolocation.getCurrentPosition((position) => {
			currentPosition = position;
			initialPosition = position;
		});
		getFindings().then((response) => {
			findings = response.data;
		});
		getResolves().then((response) => {
			resolves = response.data;
		});

		const watch = navigator.geolocation.watchPosition((position) => {
			currentPosition = position;
		});

		return () => {
			navigator.geolocation.clearWatch(watch);
		};
	});
</script>

<div class="relative flex flex-col h-full">
	<MapLibre
		center={initialPosition
			? [initialPosition.coords.longitude, initialPosition.coords.latitude]
			: [0, 0]}
		zoom={14}
		class="h-full w-full"
		style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
	>
		{#if currentPosition}
			<Marker
				lngLat={[currentPosition.coords.longitude, currentPosition.coords.latitude]}
				class="relative grid place-items-center h-6 w-6 bg-[#2563eb] rounded-full border-white border-2"
			>
				<div class="absolute bg-[#2563eb] inset-0 rounded-full custom-pulse"></div>
			</Marker>
		{/if}
		{#each findings as finding (finding.id)}
			<Marker
				lngLat={[finding.longitude, finding.latitude]}
				on:click={() => {
					goto('/findings/' + finding.id);
				}}
				class="relative grid place-items-center h-4 w-4 bg-red-600 rounded-full border-white"
			/>
		{/each}
		{#each resolves as resolve (resolve.id)}
			<Marker
				lngLat={[resolve.longitude, resolve.latitude]}
				class="relative grid place-items-center h-4 w-4 bg-green-600 rounded-full border-white"
			/>
		{/each}
	</MapLibre>
	<a href="/form" class="btn absolute bottom-12 inset-x-12 variant-filled-primary z-10">Log Trash</a
	>
</div>

<style>
	:global(.custom-pulse) {
		animation: custom-pulse 5s infinite;
	}
	@keyframes custom-pulse {
		0%,
		100% {
			transform: scale(1);
			opacity: 0.75;
		}
		50% {
			transform: scale(2.5);
			opacity: 0.1;
		}
	}
</style>
