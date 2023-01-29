const config = require(`./config.json`)

class tui {
    constructor(str = "") {
        this.value = str
    }

    /**
     * @param  {...any} arg replacements
     */
    comp(...arg) {
        this.value = this.value.replace(/%(%|\d+)/g, (a, m) =>
            m == `%` ? `%` : arg[m]
        )
        return this
    }

    select(select = true, pattern = `\x1b[7m%0\x1b[0m`) {
        select ? (this.value = new tui(pattern).comp(this.value).value) : null

        return this
    }

    box(
        width = config.displayWidth,
        height = config.displayHeight,
        pattern = " "
    ) {
        if (/^$/.test(this.value)) {
            this.value = new Array(height)
                .fill(0)
                .map((x) => new Array(width).fill(pattern).join(``))
                .join(`\n`)
        } else {
            this.center(this.width, this.value.split(`\n`).length)
        }

        return this
    }

    center(
        width = config.displayWidth,
        height = config.displayHeight,
        pattern = " "
    ) {
        let save = this.value
        this.value = ""
        this.box(width, height, pattern).inject(
            save,
            Math.floor((width - new tui(save).width) / 2),
            Math.floor((height - new tui(save).value.split(`\n`).length) / 2)
        )
        return this
    }

    inject(text = "", x = 0, y = 0) {
        let splitted_text = text.split(`\n`)

        y = (y + this.value.split(`\n`).length) % this.value.split(`\n`).length
        x = (x + this.width) % this.width

        this.value = this.value
            .split(`\n`)
            .map((str, i) => {
                if (i - y < 0) return str
                let arr = new tui(str).splitIgnoreANSI()
                arr.splice(
                    x,
                    new tui(splitted_text?.[i - y]).splitIgnoreANSI()?.length,
                    splitted_text[i - y]
                )
                return arr.join(``)
            })
            .join(`\n`)

        return this
    }

    splitIgnoreANSI() {
        return this.value.match(
            /([\x1b\x9b][[()#;?]*(?:\d{0,4}(?:;\d{0,4})*)?[0-9A-ORZcf-nqry=><])*.([\x1b\x9b][[()#;?]*(?:\d{0,4}(?:;\d{0,4})*)?[0-9A-ORZcf-nqry=><])*/g
        )
    }

    get width() {
        return Math.max(
            ...this.value
                .split(`\n`)
                .map((x) => new tui(x).splitIgnoreANSI().length)
        )
    }
}

module.exports = tui
