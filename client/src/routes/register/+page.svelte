<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton';
	import PageContainer from '$lib/components/layout/PageContainer.svelte';
	import { superForm, defaults } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';

	import { registerSchema } from '$lib/schema';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import { register } from '$lib/services/auth';
	import { setUserData } from '$lib/auth';
	import { goto } from '$app/navigation';
	const { form, errors, enhance } = superForm(defaults(zod(registerSchema)), {
		SPA: true,
		validators: zod(registerSchema),
		onUpdate({ form }) {
			if (form.valid) {
				register(form.data).then((response) => {
					setUserData(response.data);
					goto('/');
				});
			}
		}
	});
</script>

<AppBar class="bg-transparent">
	<h1 class="text-3xl tracking-tight font-bold">Register</h1>
</AppBar>
<PageContainer>
	<form use:enhance class="flex flex-col gap-6">
		<TextInput label="Firstname" bind:value={$form.firstName} error={$errors.firstName} />
		<TextInput label="Lastname" bind:value={$form.lastName} error={$errors.lastName} />
		<TextInput label="Email" bind:value={$form.email} error={$errors.email} />
		<TextInput
			label="Password"
			type="password"
			bind:value={$form.password}
			error={$errors.password}
		/>
		<TextInput
			label="Confirm Password"
			type="password"
			bind:value={$form.confirmPassword}
			error={$errors.confirmPassword}
		/>
		<button type="submit" class="btn variant-filled w-full">Register</button>
	</form></PageContainer
>
