import { map } from "karabiner.ts";
import { focusWindow } from "./utils";

export const appLaunchers = [
  // browsers
  map("c").toApp("Google Chrome"),
  map("v").toApp("Vivaldi"),
  map("b").toApp("Brave Browser"),

  // coms
  map("s").toApp("Slack"),
  map("o").toApp("Microsoft Outlook"),
  map("y").to$(focusWindow("Microsoft Teams")),

  // tools
  map("f").toApp("Finder"),
  map("w").toApp("WezTerm"),
  map("p").toApp("Postman"),
  map("t").toApp("TickTick"),
  map("m").toApp("Music"),

  // ai
  //map("g").toApp("ChatGPT"),
  // map("g").toApp("Msty"),
  map("g").toApp("Cherry Studio"),
  //map("g").toApp("Chatbox"),

  // ide's
  map("a").toApp("Visual Studio Code"),
];
