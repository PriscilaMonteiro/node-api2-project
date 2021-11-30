// implement your server here

const express = require('express');

const postsRouter = require('./posts/posts-router');

const server = express();

server.use(express.json());
server.use('/api/posts', postsRouter);

server.get('/', (req,res) => {
  res.send(`
    <h1>Posts API</h1>
    <p>Welcome to the Posts API</p>
  `);
});

module.exports = server;
