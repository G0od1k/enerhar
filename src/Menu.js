class Menu {
    /**
     * Menu constructor
     * @param {import('./Main')} main The Main class
     * @param {(string|undefined)[][]} map Map of menu button
     * @param {(menu:Menu) => void} enter Function on key press Enter
     * @param {Object} startPos Start cursor position
     * @param {number} startPos.x Start `x` cursor position
     * @param {number} startPos.y Start `y` cursor position
     */

    constructor(main, map, enter, startPos = { x: 0, y: 0 }) {
        this.main = main

        this.map = map
        this.main.keyE = (key) => {
            this.#fun(key)
            this.main.out()
        }

        this.pos = startPos
        this.val = this.map[0][0]
        this.enter = enter
    }

    /**
     * Function for moving cursor
     * @param {object} key
     * @param {string} key.name Key name
     * @param {string} key.char Character
     * @param {boolean} key.alt Is ALT
     * @param {boolean} key.shift Is SHIFT
     * @param {boolean} key.ctrl Is CTRL
     */

    #move(key) {
        let oldValue = this.val
        let oldPos = Object.assign({}, this.pos)
        let pos = this.pos
        do {
            pos.y =
                (pos.y +
                    ({ up: -1, down: 1 }[key.name] ?? 0) +
                    this.map.length) %
                this.map.length
            pos.x =
                (pos.x +
                    ({ left: -1, right: 1 }[key.name] ?? 0) +
                    this.map[pos.y].length) %
                this.map[pos.y].length

            this.val = this.map[pos.y][pos.x]
        } while (
            (oldValue == this.val &&
                (oldPos.x != pos.x || oldPos.y != pos.y)) ||
            this.val === undefined
        )
    }
    #fun(key) {
        if (["up", "left", "right", "down"].includes(key.name)) {
            this.#move(key)
        } else if (key.name == "enter") {
            this.enter(this)
        }
    }
}

module.exports = Menu
