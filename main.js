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
      .setName("Enable Animation")
      .setDesc("Toggle animations for hiding tabs.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.enableAnimation)
          .onChange(async (value) => {
            this.plugin.settings.enableAnimation = value;
            await this.plugin.saveSettings();
            this.plugin.updateCSS(); // Reapply updated CSS immediately
          })
      );
  }
}

module.exports = class HideTabsPlugin extends Plugin {
  async onload() {
    console.log("HideTabsPlugin loaded!");

    // Load settings or fallback to default
    this.settings = Object.assign(
      { enableAnimation: true }, // Default setting
      await this.loadData()
    );

    // Ensure CSS reflects the user's settings
    this.updateCSS();

    // Add the settings tab
    this.addSettingTab(new HideTabsSettingTab(this.app, this));
  }

  updateCSS() {
    // Check if CSS already exists and remove it
    const existingStyle = document.getElementById("hide-tabs-css");
    if (existingStyle) existingStyle.remove();

    // Create and inject the CSS based on the animation setting
    const style = document.createElement("style");
    style.id = "hide-tabs-css";

    style.textContent = `
      /* Hide only the tabs within the workspace header */
      .workspace-leaf-resize-handle, .workspace-tab-header-new-tab {
        display: none !important;
      }
      
      ${
        this.settings.enableAnimation
          ? `
      /* Animation for a smoother transition */
      .workspace-tab-header-container-inner > .workspace-tab-header {
        opacity: 1;
        animation: fadeOut 0.3s ease-out forwards;
      }

      @keyframes fadeOut {
        to {
          opacity: 0;
          transform: translateY(-10px);
        }
      }`
          : `
      /* Ensure no animations are applied if disabled */
      .workspace-tab-header-container-inner > .workspace-tab-header {
        animation: none !important;
        opacity: 0; /* Ensure tabs stay hidden */
        transform: translateY(-10px); /* Keep consistent position */
      }`
      }
    `;

    document.head.appendChild(style);
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  onunload() {
    console.log("HideTabsPlugin unloaded!");

    // Clean up CSS on unload
    const style = document.getElementById("hide-tabs-css");
    if (style) style.remove();
  }
};
