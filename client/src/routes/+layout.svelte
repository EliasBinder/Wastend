<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
	//disable ssr
	export const ssr = false;

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { TabGroup, Tab, TabAnchor } from '@skeletonlabs/skeleton';
	import { writable } from 'svelte/store';
	import { Map, Archive } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { loadUserData, userData } from '$lib/auth';
	import { onMount } from 'svelte';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	onMount(() => {
		loadUserData();
	});
</script>

<AppShell>
	<slot />
	<svelte:fragment slot="pageFooter">
		{#if $userData}
			<TabGroup
				justify="justify-center"
				active="variant-filled-primary"
				hover="hover:variant-soft-primary"
				flex="flex-1 lg:flex-none"
				rounded=""
				border=""
				class="bg-surface-100-800-token w-full"
			>
				<TabAnchor href="/" selected={$page.url.pathname === '/'}>
					<svelte:fragment slot="lead">
						<div class="flex justify-center">
							<Map />
						</div>
					</svelte:fragment>
					<span>Map</span>
				</TabAnchor>
				<TabAnchor href="/inventory" selected={$page.url.pathname === '/inventory'}>
					<svelte:fragment slot="lead">
						<div class="flex justify-center">
							<Archive />
						</div>
					</svelte:fragment>
					<span>Inventory</span>
				</TabAnchor>
			</TabGroup>
		{/if}
	</svelte:fragment>
</AppShell>
