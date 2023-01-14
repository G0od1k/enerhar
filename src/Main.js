const Menu = require(`./Menu`)
const IO = require(`./io/terminal`)

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
        let selected = ""
        const menu = new Menu(
            this,
            [
                ["Test", undefined, undefined],
                ["Menu", "Cent", "Car"],
                ["Three", undefined, "Six"],
                ["Four", undefined, undefined],
                ["Left", "Right", undefined],
                ["Five", undefined, undefined],
            ],
            (menu) => {
                selected = menu.val
            }
        )

        this.out = () => {
            this.io.out(
                menu.map
                    .map((x) =>
                        x
                            .map(
                                (x) =>
                                    (({ [selected]: "# ", [menu.val]: "> " }[
                                        x
                                    ] ?? "  ") + (x ?? ""))
                            )
                            .join(`\t`)
                    )
                    .join(`\n`)
            )
        }

        this.out()
    }
    quit() {
        this.io.close()
    }
}

module.exports = Main
