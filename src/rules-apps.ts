import {
  ifApp,
  map,
  rule,
  toKey,
  withCondition,
  withModifier,
} from "karabiner.ts";
import {
  floatingTerminal,
  ifAppleKeyboard,
  ifBrowser,
  ifFinder,
  ifFloatingTerminal,
  ifNotFloatingTerminal,
  regex,
} from "./patterns";
import {
  betterDeleteWord,
  historyNavi,
  openNvimGitRepo,
  tapModifiers,
} from "./utils";

export function app_finder() {
  return rule("Finder").manipulators([
    // open finder from other apps
    withCondition(ifBrowser)([
      map("f", ["command", "shift"]).to$("open ~/Downloads"),
    ]),
    withCondition(ifFinder)([
      map("f", ["command", "shift"]).to("l", ["option", "command"]),
    ]),
  ]);
}

export function app_outlook() {
  return rule("Outlook", ifApp(regex.outlook)).manipulators([
    ...betterDeleteWord(),

    map("d", ["control"]).to("delete_or_backspace", "command"), // delete
    map("a", ["control"]).to("e", "control"), // archive
    map("u", ["control"]).to("f", ["command", "shift"]), // mark as unread

    map("right_arrow", ["command", "option"]).to("]", ["shift", "control"]),
    map("left_arrow", ["command", "option"]).to("[", ["shift", "control"]),
  ]);
}

export function app_msty() {
  return rule("Msty AI", ifApp(regex.msty)).manipulators([
    ...betterDeleteWord(),

    map("t", ["command"]).to("s", ["command", "shift"]), // toggle context shield
    map("r", ["command"]).to("s", ["command", "shift"]), // toggle context shield
    map("n", ["command", "shift"]).to("s", ["command", "shift"]), // toggle context shield
    map("k", ["command"]).to("f", ["command"]), // toggle search
    map("b", ["command"]).to("1", ["command"]), // toggle side bar

    map("right_arrow", ["command", "option"]).to("right_arrow", ["option"]),
    map("left_arrow", ["command", "option"]).to("left_arrow", ["option"]),
  ]);
}

export function app_chrome() {
  return rule("Chrome", ifApp(regex.chrome)).manipulators([
    ...betterDeleteWord(),

    map("o", ["control"]).to$(openNvimGitRepo()),

    ...tapModifiers({
      "‹⌥": toKey("a", "⌘⇧"), // searchTabs
      //'<⌘': toKey('i', '⌘⌥'), // developerTools
    }),

    map("i", ["command"]).to("i", ["command", "option"]), // developerTools
  ]);
}

export function app_slack() {
  return rule("Slack", ifApp(regex.slack)).manipulators([
    ...historyNavi(),

    ...tapModifiers({
      "<⌥": toKey("d", "⌘⇧"), // showHideSideBar
      "<⌘": toKey(".", "⌘"), // hideRightBar
    }),
  ]);
}

export function app_chatgpt() {
  return rule("ChatGPT", ifApp(regex.chatgpt)).manipulators([
    ...betterDeleteWord(),

    map("b", "command").to("f6"), // showHideSideBar

    ...tapModifiers({
      "<⌥": toKey("f6"), // showHideSideBar
    }),
  ]);
}

export function app_vivaldi() {
  return rule("Vivaldi", ifApp(regex.vivaldi)).manipulators([
    ...betterDeleteWord(),

    map("o", ["control"]).to$(openNvimGitRepo()),

    //withCondition(ifAppleKeyboard)([
    ...tapModifiers({
      "<⌘": toKey("e", "⌘"),
    }),
    //]),

    map("i", ["command"]).to("i", ["command", "option"]), // developerTools
  ]);
}

export function floating_terminal() {
  return rule("Floating terminal").manipulators([
    withCondition(ifNotFloatingTerminal)([
      withModifier("Hyper")([
        map("return_or_enter").toApp(floatingTerminal.app),
      ]),
    ]),
    withCondition(ifFloatingTerminal)([
      // better to avoid long app switcher until key is released
      // withModifier("Hyper")([map("return_or_enter").to("h", ["command"])]),
      // cmd+h was not respecting the previous application
      withModifier("Hyper")([map("return_or_enter").to("tab", ["command"])]),
    ]),
  ]);
}
