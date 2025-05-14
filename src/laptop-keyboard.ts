import {
  FromKeyParam,
  map,
  rule,
  ToKeyParam, withMapper,
  withModifier
} from "karabiner.ts";
import { ifAppleKeyboard } from "./patterns";

export function laptop_keyboard() {
  return rule("Laptop Keyboard Bindings", ifAppleKeyboard).manipulators([
    // Caps Lock → Hyper
    map("caps_lock").toHyper().toIfAlone("escape").parameters({
      "basic.to_if_alone_timeout_milliseconds": 200,
    }),
    map("caps_lock", ["right_shift"]).to("escape", "right_shift"),

    // Right cmd to control
    map("right_command").to("left_control"),

    // Hyper + hjkl → Arrow keys
    withMapper<FromKeyParam, ToKeyParam>({
      j: "down_arrow",
      l: "right_arrow",
      k: "up_arrow",
      h: "left_arrow",
    })((k, v) => withModifier("Hyper")([map(k).to(v)])),

    // Hyper + s/f to switch spaces
    withModifier("Hyper")([
      map("f").to("right_arrow", ["left_control"]),
      map("s").to("left_arrow", ["left_control"]),
    ]),

    // Hyper + r/w to switch tabs
    withModifier("Hyper")([
      map("r").to("right_arrow", ["command", "option"]),
      map("w").to("left_arrow", ["command", "option"]),
    ]),
  ]);
}
