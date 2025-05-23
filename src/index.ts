import {
  layer,
  map,
  mapSimultaneous,
  rule,
  toMouseCursorPosition,
  withModifier,
  writeToProfile,
} from "karabiner.ts";
import { laptop_keyboard } from "./laptop-keyboard";
import { appLaunchers } from "./launch-apps";
import {
  ifAppleKeyboard,
  ifGlove80Keyboard,
  ifTotemKeyboard,
} from "./patterns";
import {
  app_chatgpt,
  app_chrome,
  app_finder,
  app_msty,
  app_outlook,
  app_slack,
  app_vivaldi,
  floating_terminal,
} from "./rules-apps";

// Reference config: https://github.com/evan-liu/karabiner-config/blob/main/karabiner-config.ts

// npm run build
// will replace the content of karabiner.json profile.complex_modifications

// ! Change '--dry-run' to your Karabiner-Elements Profile name.
// (--dry-run print the config json into console)
// + Create a new profile if needed.
writeToProfile(
  "Carlos",
  [
    app_finder(),
    app_outlook(),
    app_vivaldi(),
    app_chrome(),
    app_slack(),
    app_chatgpt(),
    app_msty(),

    laptop_keyboard(),

    floating_terminal(),

    layer("/", "Switch App")
      .condition(ifTotemKeyboard)
      .manipulators(appLaunchers),

    // macbook, no home row mods
    layer(";", "Switch App")
      .condition(ifAppleKeyboard)
      .manipulators(appLaunchers),

    // glove, no home row mods
    layer(";", "Switch App")
      .condition(ifGlove80Keyboard)
      .manipulators(appLaunchers),

    rule("App switch").manipulators([
      withModifier("Hyper")([
        map("spacebar").to("tab", ["command"]).toIfAlone("tab", ["command"]),
      ]),
    ]),

    rule("Homerow").manipulators([
      mapSimultaneous(["f", "j"]).to("spacebar", ["command", "shift"]), // Click
      mapSimultaneous(["f", "k"]).to("j", ["command", "shift"]), // Scroll
    ]),

    // hyperLayer("spacebar")
    //   .description("Leader Mode")
    //   .leaderMode({ sticky: true })
    //   .notification()
    //   .manipulators([
    //     withCondition(ifApp(regex.outlook))([
    //       map("j").to("down_arrow"),
    //       map("k").to("up_arrow"),
    //       map("d").to("delete_or_backspace", ["command"]), // delete
    //       map("a").to("e", ["control"]), // archive
    //       map("u").to("z", ["command"]), // undo
    //       map("r").to("t", ["command", "shift"]), // mark as unread
    //       map("t").to("t", ["command"]), // mark as read
    //       map("/").to("f", ["command", "shift"]), // search
    //     ]),
    //   ]),

    // too slow atm
    // rule('Window Management').manipulators([
    //     withModifier('Hyper')({
    //         l: raycastWin('right-half'),
    //         h: raycastWin('left-half'),
    //         e: raycastWin('maximize'),
    //         d: raycastWin('almost-maximize'),
    //         o: raycastWin('next-display'),
    //         u: raycastWin('previous-display')
    //     })
    // ])

    rule("Move Mouse").manipulators([
      withModifier("Hyper")({
        ",": toMouseCursorPosition({ x: "50%", y: "50%", screen: 0 }),
        m: toMouseCursorPosition({ x: "50%", y: "50%", screen: 2 }),
        ".": toMouseCursorPosition({ x: "50%", y: "50%", screen: 1 }),
      }),
    ]),
  ],
  {
    "basic.simultaneous_threshold_milliseconds": 50,
    "basic.to_delayed_action_delay_milliseconds": 200,
    "basic.to_if_alone_timeout_milliseconds": 200,
    "basic.to_if_held_down_threshold_milliseconds": 200,
    "mouse_motion_to_scroll.speed": 100,
  },
);
