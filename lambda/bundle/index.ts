import "dotenv/config"

import { createLocalServer } from "./server"

const PORT = process.env.PORT || 4000

const server = createLocalServer()

server.listen(PORT).then(({ url }) => {
    console.log(`Server is listening at ${url}`)
})