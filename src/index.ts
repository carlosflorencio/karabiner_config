import {
  hyperLayer,
  ifApp,
  layer,
  map,
  mapSimultaneous,
  rule,
  toMouseCursorPosition,
  withCondition,
  withModifier,
  writeToProfile,
} from "karabiner.ts";
import { laptop_keyboard } from "./laptop-keyboard";
import {
  app_chatgpt,
  app_chrome,
  app_finder,
  app_outlook,
  app_slack,
  app_vivaldi,
  floating_terminal,
} from "./rules-apps";
import { regex } from "./patterns";
import { focusWindowMainDisplay } from "./utils";

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

    laptop_keyboard(),

    floating_terminal(),

    layer(";", "apps-mode").manipulators([
      map("c").toApp("Google Chrome"),
      //map('v').toApp("Vivaldi"),
      map("v").to$(focusWindowMainDisplay("Vivaldi")),
      map("s").toApp("Slack"),
      map("f").toApp("Finder"),
      map("w").toApp("WezTerm"),
      map("o").toApp("Microsoft Outlook"),
      map("p").toApp("Postman"),
      map("t").toApp("Microsoft Teams"),
      map("g").toApp("ChatGPT"),
      map("t", "shift").toApp("TickTick"),
    ]),

    rule("Homerow").manipulators([
      mapSimultaneous(["f", "j"]).to("spacebar", ["command", "shift"]), // Click
      mapSimultaneous(["f", "k"]).to("j", ["command", "shift"]), // Scroll
    ]),

    hyperLayer("spacebar")
      .description("Leader Mode")
      .leaderMode({ sticky: true })
      .notification()
      .manipulators([
        withCondition(ifApp(regex.outlook))([
          map("j").to("down_arrow"),
          map("k").to("up_arrow"),
          map("d").to("delete_or_backspace", ["command"]), // delete
          map("a").to("e", ["control"]), // archive
          map("u").to("z", ["command"]), // undo
          map("r").to("t", ["command", "shift"]), // mark as unread
          map("t").to("t", ["command"]), // mark as read
          map("/").to("f", ["command", "shift"]), // search
        ]),
      ]),

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
