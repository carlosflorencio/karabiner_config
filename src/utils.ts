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

export function openNvimGitRepo() {
  return `osascript -e '
    tell application "System Events"
        -- Check if Vivaldi or Chrome is the frontmost app
        set frontApp to (name of first application process whose frontmost is true)
        if frontApp is "Vivaldi" or frontApp is "Google Chrome" then
            -- say frontApp & " is active"
            set currentURL to ""
            
            if frontApp is "Vivaldi" then
                tell application "Vivaldi"
                    set windowCount to count windows
                    repeat with i from 1 to windowCount
                        set currentTab to active tab of window i
                        set tabURL to URL of currentTab
                        if tabURL contains "github.com" then
                            set currentURL to tabURL
                            exit repeat
                        end if
                    end repeat
                end tell
            else if frontApp is "Google Chrome" then
                tell application "Google Chrome"
                    set windowCount to count windows
                    repeat with i from 1 to windowCount
                        set currentTab to active tab of window i
                        set tabURL to URL of currentTab
                        if tabURL contains "github.com" then
                            set currentURL to tabURL
                            exit repeat
                        end if
                    end repeat
                end tell
            end if
            
            if currentURL is "" then
                say "No active tab with GitHub URL found"
                display dialog "No active tab with GitHub URL found in " & frontApp buttons {"OK"} default button "OK"
                return
            end if
        else
            say "Neither Vivaldi nor Chrome is the active application"
            display dialog "Please make Vivaldi or Chrome the active application with a GitHub tab." buttons {"OK"} default button "OK"
            return
        end if
    end tell

    set shellCommand to "~/scripts/open_git_link.sh " & quoted form of currentURL

    -- Debugging: Write the shell command to a file in /tmp
    --do shell script "echo " & quoted form of shellCommand & " > /tmp/debug_command.txt"

    -- Now focus WezTerm and run the shell command with the URL as an argument
    tell application "WezTerm" to activate
    do shell script shellCommand
'`;
}

export function focusWindow(app: string) {
  return `osascript -e '
    tell application "${app}"
      if it is running then
        activate
      else
        launch
        delay 1
        activate
      end if
    end tell
  '`;
}
