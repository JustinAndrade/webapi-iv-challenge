const express = require('express');

const Users = require('./userDb.js');

const router = express.Router();

router.post('/', validateUser, async (req, res) => {
	try {
		console.log(Object.keys(req));
		const user = await Users.insert(req.body);
		res.status(201).json(user);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Error adding users.' });
	}
});

// router.post('/:id/posts', async (req, res) => {
// 	try {
// 		console.log({ ...req.body });
// 		const post = await Users.insert(req.body);
// 		res.status(201).json(post);
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).json({ message: 'Error retrieving users.' });
// 	}
// });

router.get('/', validateUser, async (req, res) => {
	try {
		const users = await Users.get(req.query);
		res.status(200).json(users);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Error retrieving users.' });
	}
});

router.get('/:id', validateUserId, async (req, res) => {
	try {
		const user = await Users.getById(req.params.id);
		if (user) {
			res.status(200).json(user);
		} else {
			res.status(404).json({ message: 'User id not found' });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Error retrieving users.' });
	}
});

router.get('/:id/posts', validatePost, async (req, res) => {
	try {
		const postInfo = await Users.getUserPosts(req.params.id);
		res.status(200).json(postInfo);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Error retrieving p' });
	}
});

router.delete('/:id', validateUserId, async (req, res) => {
	try {
		const count = await Users.remove(req.params.id);
		if (count > 0) {
			res.status(200).json({ message: 'The user has been deleted' });
		} else {
			res.status(404).json({ message: 'The user could not be found' });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Error retrieving user' });
	}
});

router.put('/:id', validateUserId, async (req, res) => {
	try {
		const user = await Users.update(req.params.id, req.body);
		if (user) {
			res.status(200).json(user);
		} else {
			res.status(404).json({ message: 'The use could not be found' });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Error retrieving user' });
	}
});

//custom middleware

async function validateUserId(req, res, next) {
	try {
		const { id } = req.params;
		const user = await Users.getById(id);
		if (user) {
			req.user = user;
			next();
		} else {
			next({ message: 'User not found; invalid id' });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Failed to process request' });
	}
}

function validateUser(req, res, next) {
	if (req.body && req.params.id) {
		next();
	} else {
		next({ message: 'No user present' });
	}
}

function validatePost(req, res, next) {
	if (req.body && Object.keys(req.body).length) {
		next();
	} else {
		next({ message: 'No post found' });
	}
}

module.exports = router;
