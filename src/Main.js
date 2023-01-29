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
            [["Test"], ["Menu"], ["Three"], ["Four"], ["Tři"], ["Five"]],
            (menu) => {}
        )

        this.out = () => {
            this.io.out(
                new tui()
                    .box(64, 18, " ")
                    .inject(
                        menu.map
                            .flat()
                            .map(
                                (x) =>
                                    new tui(x)
                                        .select(menu.val == x, `>>-> %0 <-<<`)
                                        .center(undefined, 1, " ").value
                            )
                            .join(`\n`),
                        0,
                        5
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
