import bodyParser from 'body-parser'
import express    from 'express'
import mongoose   from 'mongoose'
import cors       from 'cors'

import { config } from 'dotenv'
import { debug  } from './utilities/debug'
import { PORT, CONNECTION_STRING } from './utilities/config'

import v1 from './routers/v1/v1'


const server = express()

server.use(cors())
server.use(bodyParser.urlencoded({ extended: true }))
server.use(express.json())
server.use('/v1', v1)

server.listen(PORT, () => {
    if (CONNECTION_STRING === undefined) {
        console.error(`❌\tCONNECTION_STRING is not defined`);
        process.exit(1);
    }

    debug(`⏳\tCreating database connection...`);
    mongoose.connect(CONNECTION_STRING);
    mongoose.connection.on('error', (err) => {
        console.error(`❌\tDatabase connection error: ${err}`);
        process.exit(1);
    });

    debug(`✅\tConnection established`);
    debug(`✨\tServer listening on port ${PORT}`)
});