// main.js
//
// Basic Obsidian plugin that hides tabs but keeps the pane headers.
// We'll create one plugin class and an optional settings tab.

const { Plugin, PluginSettingTab, Setting } = require("obsidian");

class HideTabsSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl("h2", { text: "Hide Tabs Plugin Settings" });

    new Setting(containerEl)
      .setName("Demo setting")
      .setDesc("This is just an example setting.")
      .addToggle((toggle) =>
        toggle.setValue(true).onChange((value) => {
          console.log("Toggled setting:", value);
        })
      );
  }
}

module.exports = class HideTabsPlugin extends Plugin {
  async onload() {
    console.log("HideTabsPlugin loaded!");
    // Optionally add a settings tab
    this.addSettingTab(new HideTabsSettingTab(this.app, this));
  }

  onunload() {
    console.log("HideTabsPlugin unloaded!");
  }
};
