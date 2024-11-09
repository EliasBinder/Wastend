<script>
	import { AppBar } from '@skeletonlabs/skeleton';
	import { ArrowLeft } from 'lucide-svelte';
	import PageContainer from '$lib/components/layout/PageContainer.svelte';
	import InventoryItem from '$lib/components/InventoryItem.svelte';
	import { writable } from 'svelte/store';
	import { Droppable } from '@shopify/draggable';
	import { onMount } from 'svelte';
	import { getInventory, mergeItems } from '$lib/services/inventory';

	let droppable;
	let droppableOrigin;
	let items = [];

	// Initialize Draggable
	function initializeDraggable() {
		droppable = new Droppable(document.querySelectorAll('.draggable-container'), {
			draggable: '.item',
			dropzone: '.dropzone',
			mirror: {
				constrainDimensions: true
			}
		});

		// --- Draggable events --- //
		droppable.on('drag:start', (evt) => {
			droppableOrigin = evt.originalSource.parentNode.dataset.dropzone;
		});

		droppable.on('droppable:dropped', (evt) => {
			if (droppableOrigin !== evt.dropzone.dataset.dropzone) {
				evt.cancel();
			} else {
				handleDrop(evt);
			}
		});
	}

	onMount(() => {
		getInventory().then((response) => {
			items = response.data.items;
			initializeDraggable();
		});
	});

	function handleDrop(event) {
		const draggedElement = event.data.dragEvent.data.source;
		const targetElement = event.data.dropzone;

		if (!targetElement) return;

		const draggedItem = items.find((item) => item.name == draggedElement.dataset.id);
		const targetItem = items.find(
			(item) => item.name == targetElement.querySelector('.item').dataset.id
		);

		if (draggedItem && targetItem && draggedItem !== targetItem) {
			mergeItems({
				item1: targetItem.name,
				item2: draggedItem.name
			}).then((response) => {
				items = response.data.items;
				setTimeout(() => {
					draggedElement.remove();
					initializeDraggable();
				}, 20);
			});
		}
	}
</script>

<AppBar class="bg-transparent">
	<svelte:fragment slot="lead">
		<a href="/">
			<ArrowLeft class="w-6 h-6" />
		</a>
	</svelte:fragment>
	<h1 class="text-3xl tracking-tight font-bold">Inventory</h1>
</AppBar>

<PageContainer>
	<div class="grid grid-cols-2 gap-4 draggable-container">
		{#each items as item (item.name)}
			<div class="dropzone">
				<div class="item" data-id={item.name}>
					<InventoryItem
						emoji={item.icon}
						text={item.name
							.split('_')
							.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
							.join(' ')}
					/>
				</div>
			</div>
		{/each}
	</div>
</PageContainer>

<style>
	.dragging {
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	}
</style>
