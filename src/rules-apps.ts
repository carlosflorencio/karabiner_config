import { ifApp, map, rule, toKey, withCondition, withModifier } from 'karabiner.ts'
import { ifBrowser, ifFinder, ifFloatingTerminal, ifNotFloatingTerminal, regex } from './patterns'
import { betterDeleteWord, historyNavi, tapModifiers } from './utils'

export function app_finder() {
    return rule('Finder').manipulators([
        // open finder from other apps
        withCondition(ifBrowser)([
            map('f', ['command', 'shift']).to$("open ~/Downloads"),
        ]),
        withCondition(ifFinder)([
            map('f', ['command', 'shift']).to('l', ['option', 'command']),
        ])

    ])
}

export function app_outlook() {
    return rule('Outlook', ifApp(regex.outlook)).manipulators([
        ...betterDeleteWord(),

        // map('d', ['control']).to('delete_or_backspace', 'command'), // delete
        // map('a', ['control']).to('e', 'control'), // delete
        // map('u', ['control']).to('f', ['command', 'shift']), // mark as unread

        map('right_arrow', ['command', 'option']).to(']', ['shift', 'control']),
        map('left_arrow', ['command', 'option']).to('[', ['shift', 'control']),
    ])
}

export function app_chrome() {
    return rule('Chrome', ifApp(regex.chrome)).manipulators([
        ...betterDeleteWord(),

        ...tapModifiers({
            '‹⌥': toKey('a', '⌘⇧'), // searchTabs
            '<⌘': toKey('i', '⌘⌥'), // developerTools
        }),

        map('i', ['command']).to('i', ['command', 'option']), // developerTools
    ])
}

export function app_slack() {
    return rule('Slack', ifApp(regex.slack)).manipulators([
        ...historyNavi(),

        ...tapModifiers({
            '<⌥': toKey('d', '⌘⇧'), // showHideSideBar
            '<⌘': toKey('.', '⌘'), // hideRightBar
        }),
    ])
}

export function app_chatgpt() {
    return rule('ChatGPT', ifApp(regex.chatgpt)).manipulators([
        ...betterDeleteWord(),

        map('b', 'command').to('f6'), // showHideSideBar

        ...tapModifiers({
            '<⌥': toKey('f6'), // showHideSideBar
        }),
    ])
}

export function app_vivaldi() {
    return rule('Vivaldi', ifApp(regex.vivaldi)).manipulators([
        ...betterDeleteWord(),

        ...tapModifiers({
            '‹⌥': toKey('e', '⌘'), // search tabs
            '<⌘': toKey('i', '⌘⌥'), // developerTools
        }),

        map('i', ['command']).to('i', ['command', 'option']), // developerTools
    ])
}

export function floating_terminal() {
    return rule('Floating terminal').manipulators([
        withCondition(ifNotFloatingTerminal)([
            withModifier('Hyper')([
                map('return_or_enter').toApp("WezTerm"),
            ])
        ]),
        withCondition(ifFloatingTerminal)([
            withModifier('Hyper')([
                map('return_or_enter').to("tab", ['command'])
            ])
        ])
    ])
}
