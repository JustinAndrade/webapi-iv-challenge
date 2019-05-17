const express = require('express');
const helmet = require('helmet');
const logger = require('morgan');

const postRouter = require('./posts/postRouter.js');
const userRouter = require('./users/userRouter.js');

const server = express();

server.get('/', (req, res) => {
	res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware
server.use(express.json());
server.use(helmet());
server.use(logger('dev'));

server.use('/api/posts', postRouter);
server.use('/api/users', userRouter);

module.exports = server;
