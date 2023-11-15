import bodyParser from 'body-parser'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { PORT_BACKEND, URL_DATABASE, PORT_DATABASE, NAME_DATABASE } from './configs/app.config'

import v1 from './routers/v1/v1.router'

import { Redis } from './services/redis.service';
import { Server } from 'http';
import { Server as IoServer } from 'socket.io';

const server = express();
const httpServer = new Server(server);
const io = new IoServer(httpServer, {
    cors: {
        origin: "*", // Adjust this according to your needs
    },
    "path": "/socket/"
});

server.use(cors());
server.use(bodyParser.urlencoded({ extended: true }))
server.use(express.json())
server.use('/v1', v1)

io.on('connection', (socket) => {
    console.log('A user connected');
  
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });

httpServer.listen(PORT_BACKEND, () => {
    if (URL_DATABASE === undefined || NAME_DATABASE === undefined) {
        console.error(`❌\tURL_DATABASE is not defined`);
        process.exit(1);
    }

    console.log(`🍀 ⏳\tCreating database connection: ${URL_DATABASE}:${PORT_DATABASE}/${NAME_DATABASE}`);

    mongoose.connect((URL_DATABASE + ':' + PORT_DATABASE + '/' + NAME_DATABASE), {
        //use this for cluster atlas

        //useNewUrlParser: true,
        //useFindAndModify: false,
        //useUnifiedTopology: true,
        //w: "majority",
    });

    mongoose.connection.on('error', (err) => {
        console.error(`❌\tDatabase connection error: ${err}`);
        process.exit(1);
    });

    console.log(`🤼 ✅\tConnection established`);
    console.log(`👂 ✨\tServer listening on port ${PORT_BACKEND}`)

    Redis.getInstance().init();

});

