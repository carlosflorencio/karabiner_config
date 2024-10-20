import {
    FromKeyParam,
    ifApp,
    ifDevice,
    map,
    rule,
    toApp,
    ToKeyParam,
    withCondition,
    withMapper,
    withModifier,
    writeToProfile,
} from 'karabiner.ts'

const regex = {
    chrome: '^com\\.google\\.Chrome$',
    safari: '^com\\.apple\\.Safari$',
    firefox: '^org\\.mozilla\\.firefox$',
    vivaldi: '^com\\.vivaldi\\.Vivaldi$',
    finder: '^com\\.apple\\.finder$',
    iterm2: '^com\\.googlecode\\.iterm2$',
    alacritty: '^org\\.alacritty$',
    wezterm: '^com\\.github\\.wez\\.wezterm$',
    activityMonitor: '^com\\.apple\\.ActivityMonitor$',
    outlook: '^com\\.microsoft\\.Outlook$',
    browsers: [""],
    terminals: [""]
}

regex.browsers = [
    regex.chrome,
    regex.safari,
    regex.firefox,
    regex.vivaldi,
]

regex.terminals = [
    regex.iterm2,
    regex.alacritty,
    regex.wezterm,
]

let ifAppleKeyboard = ifDevice({ vendor_id: 1452, product_id: 834 })
let ifNotAppleKeyboard = ifAppleKeyboard.unless()
let ifTerminal = ifApp(regex.terminals)
let ifFinder = ifApp(regex.finder)
let ifBrowser = ifApp(regex.browsers)

let ifFloatingTerminal = ifApp(regex.wezterm)
let ifNotFloatingTerminal = ifFloatingTerminal.unless()


// npm run build
// will replace the content of karabiner.json profile.complex_modifications

// ! Change '--dry-run' to your Karabiner-Elements Profile name.
// (--dry-run print the config json into console)
// + Create a new profile if needed.
writeToProfile('Carlos', [
    ...laptop_keyboard(),

    // open finder from other apps
    rule('Browse shortcuts', ifBrowser).manipulators([
        map('f', ['command', 'shift']).to$("open ~/Downloads"),
    ]),

    rule('Finder shortcuts', ifFinder).manipulators([
        map('f', ['command', 'shift']).to('l', ['option', 'command']),
    ]),

    rule('Better delete word experience', ifApp([
        ...regex.browsers,
        regex.outlook
    ])).manipulators([map('delete_or_backspace', ['control', 'option']).to('delete_or_backspace', ['option']),
    map('w', ['control']).to('delete_or_backspace', ['option']),
    ]),

    rule('Floating terminal').manipulators([
        withCondition(ifNotFloatingTerminal)([
            withModifier('Hyper')([
                //map('return_or_enter').to$("/bin/sh ~/.config/aerospace/floating_terminal.sh"),
                map('return_or_enter').to$("aerospace focus-monitor main; open '/Applications/WezTerm.app'"),
            ])
        ]),
        withCondition(ifFloatingTerminal)([
            withModifier('Hyper')([
                //map('return_or_enter').to("h", ['command']) // faster
                map('return_or_enter').to("tab", ['command'])
                //map('return_or_enter').to$("osascript -e 'tell application \"System Events\" to set visible of first application process whose frontmost is true to false'"),
            ])
        ])
    ]),

    rule("Open apps").manipulators([
        withModifier(['left_control', 'option'])({
            c: toApp("Google Chrome"),
            v: toApp("Vivaldi"),
            t: toApp("Microsoft Teams"),
            s: toApp("Slack"),
            f: toApp("Finder"),
            w: toApp("WezTerm"),
            o: toApp("Microsoft Outlook")
        }),
        withModifier(['left_control', 'option', 'shift'])({
            t: toApp("TickTick"),
        })
    ])
], {
    "basic.simultaneous_threshold_milliseconds": 50,
    "basic.to_delayed_action_delay_milliseconds": 200,
    "basic.to_if_alone_timeout_milliseconds": 200,
    "basic.to_if_held_down_threshold_milliseconds": 200,
    "mouse_motion_to_scroll.speed": 100
})

function laptop_keyboard() {
    return [

        rule('Caps Lock → Hyper', ifAppleKeyboard).manipulators([
            map('caps_lock').toHyper().toIfAlone('escape').parameters({
                "basic.to_if_alone_timeout_milliseconds": 200
            }),
        ]),

        rule('Right cmd to control', ifAppleKeyboard).manipulators([
            map('right_command').to('left_control'),
        ]),

        rule('Hyper + hjkl → Arrow keys', ifAppleKeyboard).manipulators([
            withMapper<FromKeyParam, ToKeyParam>({
                j: 'down_arrow',
                l: 'right_arrow',
                k: 'up_arrow',
                h: 'left_arrow',
            })((k, v) => withModifier('Hyper')([
                map(k).to(v),
            ])
            )
        ]),

        rule('Hyper + s/f to switch spaces', ifAppleKeyboard).manipulators([
            withModifier('Hyper')([
                map('f').to('right_arrow', ['left_control']),
                map('s').to('left_arrow', ['left_control']),
            ])
        ]),

        rule('Hyper + r/w to switch tabs', ifAppleKeyboard).manipulators([
            withModifier('Hyper')([
                map('r').to('right_arrow', ['command', 'option']),
                map('w').to('left_arrow', ['command', 'option']),
            ])
        ]),
    ]
}

function tmux() {
    return rule('Tmux internal macos', ifTerminal).manipulators([
        map('t', ['command']).to('b', ['control']).to('c'),
        map('d', ['command']).to('b', ['control']).to('v'),
        map('d', ['command', 'shift']).to('b', ['control']).to('h'),
        map('w', ['command']).to('b', ['control']).to('7', ['shift']), // &

        withModifier('Hyper')([
            map('r').to('b', ['control']).to('n'),
            map('w').to('b', ['control']).to('p'),
        ]),

        withCondition(ifNotAppleKeyboard)([
            map('right_arrow', ['command', 'option']).to('b', 'control').to('n'),
            map('left_arrow', ['command', 'option']).to('b', 'control').to('p'),
        ])
    ])
}
