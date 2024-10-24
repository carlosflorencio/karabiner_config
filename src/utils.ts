import { map, SideModifierAlias, to$, ToEvent } from "karabiner.ts";

export function betterDeleteWord() {
  return [map("w", ["control"]).to("delete_or_backspace", ["option"])];
}

/** Back/Forward history in most apps. */
export function historyNavi() {
  return [
    map("right_arrow", ["command", "option"]).to("]", "⌘"),
    map("left_arrow", ["command", "option"]).to("[", "⌘"),
  ];
}

export function raycastExt(name: string) {
  return to$(`open raycast://extensions/${name}`);
}

type WindowPosition =
  | "right-half"
  | "left-half"
  | "maximize"
  | "almost-maximize"
  | "next-display"
  | "previous-display";

export function raycastWin(name: WindowPosition) {
  return to$(`open -g raycast://extensions/raycast/window-management/${name}`);
}

/**
 * Map when tap a modifier key; keep as modifier when hold.
 *
 * - ‹⌘ Show/Hide UI (e.g. left sidebars, or all UI)
 * - ‹⌥ Run current task (re-run)
 * - ‹⌃ Run list
 *
 * - ›⌘ Show/Hide UI (e.g. right sidebars, or terminal)
 * - ›⌥ Command Palette (e.g. ⌘K, ⌘P)
 * - ›⌃ History (e.g. recent files)
 */
export function tapModifiers(
  v: Partial<Record<SideModifierAlias | "fn", ToEvent>>,
) {
  return Object.entries(v).map(([k, to]) => {
    let key = k as SideModifierAlias | "fn";
    return map(key).to(key).toIfAlone(to);
  });
}

/**
 * Focus the app window on the main display
 *
 * Otherwise macOS might focus the window on the secondary display
 */
export function focusWindowMainDisplay(app: string) {
  return `osascript -e '
    set appName to "${app}"
    tell application "System Events"
        set isRunning to (count of (application processes whose name is appName)) > 0
    end tell

    if isRunning then
        tell application appName
            set windowList to every window
            repeat with aWindow in windowList
                if visible of aWindow is true then
                    set currentDesktop to do shell script "defaults read com.apple.spaces spans-displays"
                    if currentDesktop = "0" then
                        set index of aWindow to 1
                        activate
                        exit repeat
                    end if
                end if
            end repeat
        end tell
    else
        tell application appName to activate
    end if
    '`;
}
