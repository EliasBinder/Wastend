<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import { writable } from 'svelte/store';

	let videoElement;
	let canvasElement;
	let photoDataUrl = writable(null);
	const dispatch = createEventDispatcher();

	onMount(() => {
		establishStream();
	});

	function establishStream() {
		navigator.mediaDevices
			.getUserMedia({
				video: {
					facingMode: 'environment'
				}
			})
			.then((stream) => {
				videoElement.srcObject = stream;
				videoElement.play();
			})
			.catch((error) => {
				console.error('Error accessing the camera:', error);
			});
	}

	function takePhoto() {
		canvasElement.width = videoElement.videoWidth;
		canvasElement.height = videoElement.videoHeight;
		const context = canvasElement.getContext('2d');
		context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
		photoDataUrl.set(canvasElement.toDataURL('image/jpeg'));
	}

	function retryPhoto() {
		photoDataUrl.set(null);
		establishStream();
	}

	function acceptPhoto() {
		photoDataUrl.subscribe((photo) => {
			const byteString = atob(photo.split(',')[1]);
			const ab = new ArrayBuffer(byteString.length);
			const ia = new Uint8Array(ab);
			for (let i = 0; i < byteString.length; i++) {
				ia[i] = byteString.charCodeAt(i);
			}
			const blob = new Blob([ab], { type: 'image/png' });
			const file = new File([blob], 'image.png', { type: 'image/png' });

			dispatch('photoCaptured', { photo: file });
		});
	}
</script>

<div class="relative w-full h-full">
	<canvas bind:this={canvasElement} class="hidden"></canvas>

	{#if $photoDataUrl}
		<div class="relative h-full w-full">
			<img src={$photoDataUrl} alt="Captured photo" class="h-full w-full object-cover" />
			<div class="gap-4 w-full absolute bottom-10 flex justify-center">
				<button on:click={retryPhoto} class="px-4 py-2 bg-red-500 text-white rounded">Retry</button>
				<button on:click={acceptPhoto} class="px-4 py-2 bg-green-500 text-white rounded"
					>Accept</button
				>
			</div>
		</div>
	{:else}
		<div class="relative h-full w-full">
			<video bind:this={videoElement} class="h-full w-full object-cover"></video>
			<button
				on:click={takePhoto}
				class="absolute bottom-10 left-1/2 -translate-x-1/2 h-16 w-16 border-white border-4 rounded-full bg-white/10"
			></button>
		</div>
	{/if}
</div>
