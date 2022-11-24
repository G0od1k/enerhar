const madge = require("madge")

madge("./src/index.js")
    .then((res) => res.image("build/graph.svg"))
    .then((writtenImagePath) => {
        console.log("Image written to " + writtenImagePath)
    })
