const tui = require("../tui")

class IO {
    /**
     * IO constructor
     * @param {import('../Main')} main The Main class
     */
    constructor(main) {
        this.main = main

        process.title = main.pkg.name
        this.#ctrlClear()

        this.out("\x1b[?25l")

        // Onresize
        process.stdout.on(`resize`, () => this.#onresize())

        const stdin = process.stdin
        require(`readline`).emitKeypressEvents(stdin)
        if (stdin.isTTY) {
            stdin.setRawMode(true)
        } else {
            this.out("noTTY")
            process.exit()
        }
        stdin.resume()
        stdin.on(`keypress`, (char, key) => this.input(char, key))
    }
    input(char, key) {
        if (key && key.name == `f4`) this.main.quit()
        if (key && key.name == `c` && key.ctrl) {
            this.#ctrlClear()
        }

        key.alt = key.meta
        delete key.meta

        if (key.name == `return`) key.name = `enter`

        if (
            [`up`, `down`, `left`, `right`].includes(key.name) &&
            key.sequence.slice(0, 2) == `\x1b\x1b`
        ) {
            key.alt = true
        }

        this.main.keyE(key)
    }
    out(text = ``, raw = false) {
        this.#clear()
        process.stdout.write(
            raw
                ? text
                : new tui(text).center(
                      process.stdout.columns,
                      process.stdout.rows
                  ).value + `\x1b[?25l`
        )
    }
    #clear() {
        // this.out(`\x1bc`)
        console.clear()
    }
    #ctrlClear() {
        this.out(`\x1b[3J\x1b[2J\x1b[1J\x1bc`, true)
    }
    #onresize() {
        this.#clear()
        if (!this.#isCorrectSize()) {
            this.#ctrlClear()
            this.out(
                new tui(this.main.lang["io.message.resize"]).comp(
                    process.stdout.columns + `\xd7` + process.stdout.rows,
                    this.main.cfg.displayWidth +
                        `\xd7` +
                        this.main.cfg.displayHeight
                ).value,
                true
            )
        } else {
            this.main.out()
        }
    }
    #isCorrectSize() {
        return (
            this.main.cfg.displayWidth <= process.stdout.columns &&
            this.main.cfg.displayHeight <= process.stdout.rows
        )
    }
    close() {
        process.stdout.write(`\x1b[?25h`)
        this.#ctrlClear()
        process.exit()
    }
}

module.exports = IO
