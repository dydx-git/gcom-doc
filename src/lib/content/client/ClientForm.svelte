<script lang="ts">
	import {
		Column,
		ComposedModal,
		ModalBody,
		ModalFooter,
		ModalHeader,
		Row,
		TextInput
	} from 'carbon-components-svelte';
	export let open = false;
	export let isValid = false;
	const onOpen = (e: Event) => {
		console.log(e);
	};
	const onClose = (e: Event) => {
		console.log(e);
	};
</script>

<ComposedModal
	preventCloseOnClickOutside
	bind:open
	selectorPrimaryFocus="#name"
	on:open={onOpen}
	on:close
	on:submit
>
	<ModalHeader label="Create New" title="Client" />
	<ModalBody hasForm>
		<Row>
			<Column sm={12} md={8} lg={8}>
				<TextInput id="name" labelText="Name" placeholder="Client Name" />
			</Column>
			<Column sm={12} md={8} lg={8}>
				<TextInput id="name" labelText="Company" placeholder="Company Name" />
			</Column>
		</Row>
	</ModalBody>
	<ModalFooter
		primaryButtonText="Proceed"
		primaryButtonDisabled={!isValid}
		secondaryButtonText="Cancel"
		on:click:button--secondary={() => (open = false)}
	/>
</ComposedModal>
