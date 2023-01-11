<script lang="ts">
    import { DataTable } from "carbon-components-svelte";

    export let title = "Default title";
    export let description = "Default description";
</script>

<DataTable>
    <strong slot="title">{ title }</strong>
    <span slot="description" style="font-size: 1rem">
        { description }
    </span>
</DataTable>