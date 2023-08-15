'use strict'

/**
 * Module dependencies.
 */

import express from "express";
import logger from "morgan";
import path from "path";
import fs from "fs";
import https from "https";

import { fileURLToPath } from 'url';



const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

var app = express();
app.use(express.json());
// log requests
app.use(logger('dev'));
app.use('/static/', express.static(path.join(__dirname, 'static/')));
app.use('/', express.static(path.join(__dirname, '/')));

var sleep = (ms) => new Promise(response => setTimeout(response, ms));

app.post('/api', async (req, res) => {
    await sleep(5000);
    res.json({success: "yes", params: req.body});
    // return sendEventsToAll({success: "yes", params: req.body});
});

const dummyContactData = {
    contactId: "123"
};

function constructSSE(res, event, id, data) {
    res.write('id: ' + id + '\n');
    res.write('event: ' + id + '\n');
    res.write("data: " + data + '\n\n');
}

var stateMachine = [
    "ContactIncoming","ContactConnected", "ContactEnded"
];

app.get('/events', async (request, response) => {
    const headers = {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    };
    response.writeHead(200, headers);

    var counter  = 0;

    var interval = setInterval(() => {
        const chunk = [
            `event: ${counter < 20 ? "ContactIncoming" : "ContactEnded"}`,
           `id: ${Date.now()}`,
           `data: {connected: false}`,
           "\n\n"
         ].join("\n");

       // response.write('id: ' + new Date().getTime() + '\n');
       response.write(chunk);
    
        counter++;

        if(counter >= 20){
            clearInterval(interval)
        }

    }, 1000);
    
});


  

https
  .createServer(
		// Provide the private and public key to the server by reading each
		// file's content with the readFileSync() method.
    {
      key: fs.readFileSync(path.join(__dirname, 'www.locks.com-key.pem')),
      cert: fs.readFileSync( path.join(__dirname, 'www.locks.com.pem'))
    },
    app
  )
  .listen(5000, () => {
    console.log("serever is runing at port 5000");
  });