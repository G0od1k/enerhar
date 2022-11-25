const path = require(`path`)
const fs = require(`fs`)

const TerserPlugin = require("terser-webpack-plugin")
const webpack = require(`webpack`)

const pkg = require(`../package.json`)

fs.rmSync(path.resolve(__dirname, `../build`), { recursive: true, force: true })

const langs = fs.readdirSync(`./src/lang`).map((x) => x.slice(0, -5))

console.log(
    `Languages: ${langs.map((x) => `\x1b[93m${x}\x1b[0m`).join(`, `)}\n`
)

langs.forEach((lang) => {
    webpack(
        {
            mode: `production`,
            entry: `./src/index.js`,
            output: {
                path: path.resolve(__dirname, `../build`),
                filename: `${pkg.name}@${pkg.version}[${lang}].js`,
            },
            target: `node`,
            externalsPresets: {
                node: true,
            },
            resolve: {
                extensions: [".json", ".js"],
            },
            optimization: {
                minimizer: [
                    new TerserPlugin({
                        extractComments: false,
                    }),
                ],
            },
            plugins: [
                new webpack.NormalModuleReplacementPlugin(
                    /lang\/\w+/,
                    `./lang/${lang}.json`
                ),
                new webpack.BannerPlugin({
                    banner: fs.readFileSync(`LICENSE`, `utf-8`),
                }),
            ],
        },
        (err, stats) => {
            if (err) {
                console.log(err)
                return
            }

            console.log(stats.toString({ chunks: false, colors: true }) + `\n`)
        }
    )
})
