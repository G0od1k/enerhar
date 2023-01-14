let text = `Languages json file test complete`
console.time(text)

const fs = require(`fs`)

const langs = fs.readdirSync(`./src/lang`).map((x) => x.slice(0, -5))

let words = {}

langs.forEach((x, i) => {
    const json = require(`../src/lang/${x}.json`)

    Object.keys(json).forEach((word) => {
        words[word] ??= new Array(langs.length).fill(false)

        words[word][i] = true
    })
})

let totalMis = 0
let result = ``

langs.forEach((lang, i) => {
    let mis = 0
    let misWords = []

    Object.keys(words).forEach((l) => {
        if (!words[l][i]) {
            misWords.push(l)
            mis += 1
        }
    })

    totalMis += mis

    if (mis) {
        result += `    \x1b[1m\x1b[31m${mis}\x1b[0m \x1b[33m${lang}\x1b[0m: ${misWords
            .map((x) => `\x1b[36m${x}\x1b[0m`)
            .join(`, `)}\n`
    }
})

process.stdout.write(`\x1b[1m\x1b[3${totalMis ? `1m✗` : `2m✓`}\x1b[0m `)
console.timeEnd(text)
if (totalMis) {
    console.log(result.trimEnd())
    process.stdout.write(
        `Total mis: \x1b[1m\x1b[31m${totalMis ?? ``}\x1b[0m\n\n`
    )
}
