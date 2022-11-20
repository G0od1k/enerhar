const path = require(`path`)
const fs = require(`fs`)

const TerserPlugin = require("terser-webpack-plugin")
const webpack = require(`webpack`)

const pkg = require(`../package.json`)

webpack(
    {
        mode: `production`,
        entry: `./src/index.js`,
        output: {
            path: path.resolve(__dirname, `../build`),
            filename: `${pkg.name}@${pkg.version}.js`,
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

        console.log(stats.toString({ chunks: false, colors: true }))
    }
)
