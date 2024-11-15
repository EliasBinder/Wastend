<script lang="ts">
	import { onMount } from 'svelte';
	import { Layer, GeoJSON, MapLibre, Marker, HeatmapLayer } from 'svelte-maplibre';
	import TrashForm from '../full-form/TrashForm.svelte';
	import { getFindings, getResolves } from '$lib/services/finding';
	import { goto } from '$app/navigation';
	import { getEvents } from '$lib/services/event';
	let currentPosition: GeolocationPosition;
	let initialPosition: GeolocationPosition;
	let findings = [];
	let resolves = [];
	let circleSource;
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
		getEvents().then((response) => {
			const events = response.data;
			circleSource = {
				type: 'FeatureCollection',
				features: events.map((e) => ({
					type: 'Feature',
					geometry: { type: 'Point', coordinates: [e.longitude, e.latitude] }
				}))
			};
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
		{#if circleSource}
			<GeoJSON id="circle-data" type="geojson" data={circleSource}>
				<Layer
					id="circles"
					type="circle"
					paint={{
						'circle-radius': ['interpolate', ['linear'], ['zoom'], 0, 0, 14, 50, 22, 500],
						// Slightly smaller radius for inner circle

						'circle-color': 'rgba(0,0,255,0.5)',
						'circle-stroke-width': 1,
						'circle-stroke-color': 'rgba(0,0,255,0.75)'
						// Light blue with lower opacity
					}}
				/>
			</GeoJSON>
		{/if}
		<GeoJSON
			id="findings"
			data={{
				type: 'FeatureCollection',
				features: findings.map((f) => ({
					type: 'Feature',
					geometry: {
						type: 'Point',
						coordinates: [f.longitude, f.latitude]
					}
				}))
			}}
		>
			<HeatmapLayer
				maxzoom={12}
				paint={{
					'heatmap-weight': ['interpolate', ['linear'], ['get', 'mag'], 0, 0, 6, 1],
					'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
					'heatmap-color': [
						'interpolate',
						['linear'],
						['heatmap-density'],
						0,
						'rgba(33,102,172,0)',
						0.2,
						'rgb(103,169,207)',
						0.4,
						'rgb(209,229,240)',
						0.6,
						'rgb(253,219,199)',
						0.8,
						'rgb(239,138,98)',
						1,
						'rgb(178,24,43)'
					],
					'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 20],
					'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 9, 0]
				}}
			/>
		</GeoJSON>
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
	<a href="/form" class="btn absolute bottom-12 inset-x-12 variant-filled-primary z-10"
		>Report Trash</a
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
