import {
    FromKeyParam,
    ifApp,
    ifDevice,
    map,
    rule,
    ToKeyParam,
    withCondition,
    withMapper,
    withModifier,
    writeToProfile,
} from 'karabiner.ts'

let ifAppleKeyboard = ifDevice({ vendor_id: 1452, product_id: 834 })
let ifNotAppleKeyboard = ifAppleKeyboard.unless()
let ifTerminal = ifApp([
    '^com\\.googlecode\\.iterm2$',
    '^org\\.alacritty$',
])
let ifFinder = ifApp('^com\\.apple\\.finder$')
let ifBrowser = ifApp([
    '^com\\.google\\.Chrome$',
    '^com\\.apple\\.Safari$',
    '^org\\.mozilla\\.firefox$',
    '^com\\.vivaldi\\.Vivaldi$',
])
let ifFloatingTerminal = ifApp('^com\\.github\\.wez\\.wezterm$')
//let ifFloatingTerminal = ifApp('^org\\.alacritty$')
let ifNotFloatingTerminal = ifFloatingTerminal.unless()
//let ifActivityMonitor = ifApp('^com\\.apple\\.ActivityMonitor$')


// npm run build
// will replace the content of karabiner.json profile.complex_modifications

// ! Change '--dry-run' to your Karabiner-Elements Profile name.
// (--dry-run print the config json into console)
// + Create a new profile if needed.
writeToProfile('Carlos', [
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

    tmux(), // order matters

    rule('Hyper + r/w to switch tabs', ifAppleKeyboard).manipulators([
        withModifier('Hyper')([
            map('r').to('right_arrow', ['command', 'option']),
            map('w').to('left_arrow', ['command', 'option']),
        ])
    ]),

    // open finder from other apps
    rule('Browse shortcuts', ifBrowser).manipulators([
        map('f', ['command', 'shift']).to$("open ~/Downloads"),
    ]),

    rule('Finder shortcuts', ifFinder).manipulators([
        map('f', ['command', 'shift']).to('l', ['option', 'command']),
    ]),

    rule('Better delete word experience', ifBrowser).manipulators([
        map('delete_or_backspace', ['control', 'option']).to('delete_or_backspace', ['option']),
    ]),

    rule('Floating terminal').manipulators([
        withCondition(ifNotFloatingTerminal)([
            withModifier('Hyper')([
                map('return_or_enter').to$("open '/Applications/WezTerm.app'"),
            ])
        ]),
        withCondition(ifFloatingTerminal)([
            withModifier('Hyper')([
                map('return_or_enter').to("h", ['command']) // faster
                //map('return_or_enter').to$("osascript -e 'tell application \"System Events\" to set visible of first application process whose frontmost is true to false'"),
            ])
        ])
    ]),
], {
    "basic.simultaneous_threshold_milliseconds": 50,
    "basic.to_delayed_action_delay_milliseconds": 200,
    "basic.to_if_alone_timeout_milliseconds": 200,
    "basic.to_if_held_down_threshold_milliseconds": 200,
    "mouse_motion_to_scroll.speed": 100
})

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
