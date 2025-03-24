import { ifApp, ifDevice } from "karabiner.ts";

// osascript -e 'id of app "Application Name"'
export const regex = {
  chrome: "^com\\.google\\.Chrome$",
  safari: "^com\\.apple\\.Safari$",
  firefox: "^org\\.mozilla\\.firefox$",
  vivaldi: "^com\\.vivaldi\\.Vivaldi$",
  finder: "^com\\.apple\\.finder$",
  iterm2: "^com\\.googlecode\\.iterm2$",
  alacritty: "^org\\.alacritty$",
  wezterm: "^com\\.github\\.wez\\.wezterm$",
  warp: "^dev\\.warp\\.Warp-Stable$",
  activityMonitor: "^com\\.apple\\.ActivityMonitor$",
  outlook: "^com\\.microsoft\\.Outlook$",
  slack: "^com\\.tinyspeck\\.slackmacgap$",
  chatgpt: "^com\\.openai\\.chat$",
  msty: "^app\\.msty\\.app$",
  chatbox: "^xyz\\.chatboxapp\\.app$",
  browsers: [""],
  terminals: [""],
};

regex.browsers = [regex.chrome, regex.safari, regex.firefox, regex.vivaldi];

regex.terminals = [regex.iterm2, regex.alacritty, regex.wezterm];

export const ifAppleKeyboard = ifDevice({ is_built_in_keyboard: true });
export const ifNotAppleKeyboard = ifAppleKeyboard.unless();
export const ifTotemKeyboard = ifDevice({ vendor_id: 7504 });
export const ifGlove80Keyboard = ifDevice({ vendor_id: 5824 });
export const ifTerminal = ifApp(regex.terminals);
export const ifFinder = ifApp(regex.finder);
export const ifBrowser = ifApp(regex.browsers);

export const floatingTerminal = {
  app: "Wezterm",
  regex: regex.wezterm,
};

// export const floatingTerminal = {
//     app: "Warp",
//     regex: regex.warp
// }

export const ifFloatingTerminal = ifApp(floatingTerminal.regex);
export const ifNotFloatingTerminal = ifFloatingTerminal.unless();
