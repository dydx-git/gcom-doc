<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Column, Grid, PasswordInput, Row, TextInput } from 'carbon-components-svelte';
	import { Login } from 'carbon-icons-svelte';
</script>

<Grid>
	<h1>Login</h1>
	<form use:enhance method="POST">
		<Column lg={{ offset: 6, span: 4 }}>
			<Row>
				<TextInput labelText="Username" name="username" required />
			</Row>
			<Row>
				<PasswordInput labelText="Password" name="password" required />
			</Row>
			<Button style="float: right; margin-right: -16px" kind="primary" type="submit" icon={Login}>
				Login
			</Button>
		</Column>
	</form>
</Grid>
