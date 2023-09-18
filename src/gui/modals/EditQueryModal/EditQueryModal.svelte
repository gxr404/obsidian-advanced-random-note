<script lang="ts">
	import { onDestroy } from "svelte";
	import { QUERY_TYPES, Query } from "src/types";

	export let query: Query;
	export let handleChange: (query: Query) => void;

	const emitHandleChange = () => {
		handleChange(query);
	};

	onDestroy(() => {
		emitHandleChange();
	});
</script>

<h2 class="title">
	<input
		class="title__input"
		type="text"
		placeholder="Query name"
		bind:value={query.name}
		on:input={emitHandleChange}
	/>
</h2>

<div class="content">
	<!-- Create command -->
	<div class="setting-item mod-toggle">
		<div class="setting-item-info">
			<div class="setting-item-name">Create command</div>
			<div class="setting-item-description">
				Make the query into an executable command.
			</div>
		</div>
		<div class="setting-item-control">
			<div
				class="checkbox-container"
				class:is-enabled={query.createCommand}
				on:click={() => {
					query.createCommand = !query.createCommand;
					emitHandleChange();
				}}
			>
				<input
					type="checkbox"
					tabindex="0"
					bind:checked={query.createCommand}
				/>
			</div>
		</div>
	</div>

	<!-- Use exluded folders -->
	<div class="setting-item mod-toggle">
		<div class="setting-item-info">
			<div class="setting-item-name">Use disabled folders</div>
			<div class="setting-item-description">
				Use disabled folders from settings.
			</div>
		</div>
		<div class="setting-item-control">
			<div
				class="checkbox-container"
				class:is-enabled={query.useDisabledFolders}
				on:click={() => {
					query.useDisabledFolders = !query.useDisabledFolders;
					emitHandleChange();
				}}
			>
				<input
					type="checkbox"
					tabindex="0"
					bind:checked={query.useDisabledFolders}
				/>
			</div>
		</div>
	</div>

	<!-- Use Dataview -->
	<div class="setting-item">
		<div class="setting-item-info">
			<div class="setting-item-name">Query type</div>
			<div class="setting-item-description">
				Use Dataview as query language.
			</div>
		</div>
		<div class="setting-item-control">
			<select
				class="dropdown"
				bind:value={query.type}
				on:change={emitHandleChange}
			>
				{#each QUERY_TYPES as type}
					<option value={type}>{type}</option>
				{/each}
			</select>
		</div>
	</div>

	<div class="content">
		<span>Query:</span>
		<textarea
			bind:value={query.query}
			rows={12}
			on:input={emitHandleChange}
		/>
	</div>
</div>

<style>
	.title {
		text-align: center;
	}

	.title__input {
		text-align: center;
		background: transparent;
		padding: 0;
		border: none;
		font-size: var(--h2-size);
		width: 100%;
	}

	.content {
		display: flex;
		flex-direction: column;
		gap: 1em;
	}
</style>