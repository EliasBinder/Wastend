<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton';
	import PageContainer from '$lib/components/layout/PageContainer.svelte';
	import { superForm, defaults } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';

	import { loginSchema } from '$lib/schema';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import { login } from '$lib/services/auth';
	import { setUserData } from '$lib/auth';
	const { form, errors, enhance } = superForm(defaults(zod(loginSchema)), {
		SPA: true,
		validators: zod(loginSchema),
		onUpdate({ form }) {
			if (form.valid) {
				login(form.data).then((response) => {
					setUserData(response.data);
				});
			}
		}
	});
</script>

<AppBar>
	<h1 class="text-3xl tracking-tight font-bold">Login</h1>
</AppBar>
<PageContainer>
	<form use:enhance class="flex flex-col gap-6">
		<TextInput label="Email" bind:value={$form.email} error={$errors.email} />
		<TextInput
			label="Password"
			type="password"
			bind:value={$form.password}
			error={$errors.password}
		/>
		<button type="submit" class="btn variant-filled w-full">Login</button>
		<a href="/register" class="text-center text-white underline"> No account? Register here </a>
	</form>
</PageContainer>
