const IO = require(`./io/terminal`)

const Menu = require(`./Menu`)
const tui = require(`./tui`)

class Main {
    constructor() {
        this.lang = require(`./lang/en.json`)
        this.pkg = require(`../package.json`)
        this.cfg = require(`./config.json`)
        this.io = new IO(this)

        this.out = () => {}
        this.keyE = (key) => {}

        this.mainMenu()
    }
    mainMenu() {
        const menu = new Menu(
            this,
            [["new_game"], ["load_game"], ["what_that"], ["quit"]],
            (menu) =>
                ({
                    new_game: () => {},
                    load_game: () => {},
                    what_that: () => {},
                    quit: () => {
                        this.quit()
                    },
                }[menu.val]())
        )

        this.out = () => {
            this.io.out(
                new tui()
                    .box(64, 18)
                    .inject(
                        ` _______ _       _______ _______         _______ _______\n(  ____ ( (    /(  ____ (  ____ |\\     /(  ___  (  ____ )\n| (    \\|  \\  ( | (    \\| (    )| )   ( | (   ) | (    )|\n| (__   |   \\ | | (__   | (____)| (___) | (___) | (____)|\n|  __)  | (\\ \\) |  __)  |     __|  ___  |  ___  |     __)\n| (     | | \\   | (     | (\\ (  | (   ) | (   ) | (\\ (\n| (____/| )  \\  | (____/| ) \\ \\_| )   ( | )   ( | ) \\ \\__\n(_______|/    )_(_______|/   \\__|/     \\|/     \\|/   \\__/`,
                        3,
                        0
                    )
                    .inject(
                        menu.map
                            .flat()
                            .map(
                                (x) =>
                                    new tui(this.lang["menu.main_menu." + x])
                                        .select(menu.val == x, `>>-> %0 <-<<`)
                                        .center(undefined, 1, " ").value
                            )
                            .join(`\n`),
                        0,
                        10
                    )
                    .inject(
                        this.pkg.version +
                            "+lang-" +
                            this.lang["language.code"],
                        0,
                        -1
                    ).value
            )
        }

        this.out()
    }
    quit() {
        this.io.close()
    }
}

module.exports = Main
