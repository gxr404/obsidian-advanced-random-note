import { App, DropdownComponent, PluginSettingTab, Setting } from "obsidian";
import QueryView from "src/gui/queryItem/QueryView.svelte";
import AdvancedRandomNote from "./main";
import { type OpenType, type Query } from "./types";
import { getOpenTypeLabels, toRecord } from "./utilities";

export interface Settings {
	queries: Array<Query>;
	disabledFolders: string;
	debug: boolean;
	openType: OpenType;
	setActive: boolean;
	defaultQuery: Query | false;
}

export const DEFAULT_SETTINGS: Settings = {
	queries: [],
	disabledFolders: "",
	debug: false,
	openType: "Active Leaf",
	setActive: true,
	defaultQuery: false,
};

export class SettingTab extends PluginSettingTab {
	plugin: AdvancedRandomNote;
	defaultQuerySetting?: Setting;

	constructor(app: App, plugin: AdvancedRandomNote) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		this.containerEl.empty();
		this.addSetting();
		this.addQueriesSetting();
	}

	addSetting() {
		// Make files active
		new Setting(this.containerEl)
			.setName("Open files as active")
			.setDesc("Make files active when they are opened.")
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.setActive)
					.onChange(async (value) => {
						this.plugin.settings.setActive = value;
						await this.plugin.saveSettings();
					});
			});

		// Open type
		new Setting(this.containerEl)
			.setName("Open in")
			.setDesc("Where to open files.")
			.addDropdown((dropdown) =>
				dropdown
					.addOptions(toRecord(getOpenTypeLabels()))
					.setValue(this.plugin.settings.openType)
					.onChange(async (value) => {
						this.plugin.settings.openType = value as OpenType;
						await this.plugin.saveSettings();
					})
			);

		// Default query
		this.defaultQuerySetting = new Setting(this.containerEl)
			.setName("Default Query")
			.setDesc("The default start query for the ribbon button.")
		this.updateDefaultQueryDropdown()

		// Disabled folders setting
		new Setting(this.containerEl)
			.setName("Disabled folders")
			.setDesc("Skips these folders when searching for files.")
			.addTextArea((text) => {
				text.setPlaceholder("templates/")
					.setValue(this.plugin.settings.disabledFolders)
					.onChange(async (value) => {
						this.plugin.settings.disabledFolders = value.trim();
						await this.plugin.saveSettings();
					});
			});
	}

	addQueriesSetting() {
		// Title
		this.containerEl.createEl("div", {
			text: "Queries",
			cls: "setting-item setting-item-heading",
		});

		// Add query list
		const setting = new Setting(this.containerEl);
		setting.infoEl.remove();
		setting.settingEl.style.display = "block";
		new QueryView({
			target: setting.settingEl,
			props: {
				plugin: this.plugin,
				queries: this.plugin.settings.queries,
				saveQueries: async (queries: Query[]) => {
					this.plugin.settings.queries = queries;
					await this.plugin.saveSettings();
					this.updateDefaultQueryDropdown();
				},
			},
		});
	}

	async updateDefaultQueryDropdown() {
		if (!this.defaultQuerySetting) return
		const { settingEl } = this.defaultQuerySetting
		const oldDropdown = settingEl.querySelector('.dropdown')
		if (oldDropdown) settingEl.removeChild(oldDropdown)

		const dropdown = new DropdownComponent(settingEl)
		const { queries } = this.plugin.settings
		const { defaultQuery } = this.plugin.settings
		const options = queries.map((item) => [item.id, item.name])
		const currentDefaultQuery = queries.find((item) => defaultQuery && item.id === defaultQuery.id)
		if (!currentDefaultQuery) {
			this.plugin.settings.defaultQuery = false
			await this.plugin.saveSettings()
			this.plugin.updateTooltip()
		}
		dropdown
			.addOption('None', 'None')
			.addOptions(Object.fromEntries(options))
			.setValue(currentDefaultQuery ? currentDefaultQuery.id : 'None')
			.onChange(async (value) => {
				this.plugin.settings.defaultQuery = queries.find((item) => item.id === value) || false
				await this.plugin.saveSettings()
				this.plugin.updateTooltip()
			})
	}
}
