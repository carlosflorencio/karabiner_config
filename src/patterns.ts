import { ifApp, ifDevice } from "karabiner.ts";

export const regex = {
  chrome: "^com\\.google\\.Chrome$",
  safari: "^com\\.apple\\.Safari$",
  firefox: "^org\\.mozilla\\.firefox$",
  vivaldi: "^com\\.vivaldi\\.Vivaldi$",
  finder: "^com\\.apple\\.finder$",
  iterm2: "^com\\.googlecode\\.iterm2$",
  alacritty: "^org\\.alacritty$",
  wezterm: "^com\\.github\\.wez\\.wezterm$",
  activityMonitor: "^com\\.apple\\.ActivityMonitor$",
  outlook: "^com\\.microsoft\\.Outlook$",
  slack: "^com\\.tinyspeck\\.slackmacgap$",
  chatgpt: "^com\\.openai\\.chat$",
  msty: "^app\\.msty\\.app$",
  browsers: [""],
  terminals: [""],
};

regex.browsers = [regex.chrome, regex.safari, regex.firefox, regex.vivaldi];

regex.terminals = [regex.iterm2, regex.alacritty, regex.wezterm];

export const ifAppleKeyboard = ifDevice({ vendor_id: 1452, product_id: 834 });
export const ifNotAppleKeyboard = ifAppleKeyboard.unless();
export const ifTerminal = ifApp(regex.terminals);
export const ifFinder = ifApp(regex.finder);
export const ifBrowser = ifApp(regex.browsers);

export const ifFloatingTerminal = ifApp(regex.wezterm);
export const ifNotFloatingTerminal = ifFloatingTerminal.unless();
