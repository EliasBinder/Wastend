<script lang="ts">
	export let emoji;
	export let text;
	export let isMergeTarget: boolean;
	export let isDragging: boolean;
</script>

<div
	{...$$restProps}
	on:dragstart
	on:dragover
	on:drop
	on:dragend
	on:touchend
	on:touchstart
	on:touchmove
	class="relative flex hyphens-auto transition-all flex-col gap-4 p-6 rounded-lg bg-white/40 active:bg-white/50 border-2 items-center justify-center {isMergeTarget
		? 'border-white'
		: 'border-transparent'}
		{isDragging ? 'shadow-lg scale-105' : ''}

		"
>
	<div class="text-4xl">
		{emoji}
	</div>
	<span class="text-lg text-center font-bold"> {text}</span>
</div>
