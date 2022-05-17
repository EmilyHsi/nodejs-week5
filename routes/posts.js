var express = require('express');
var router = express.Router();
const PostControllers = require('../controllers/posts');

router.get('/', PostControllers.getPosts);

router.post('/', PostControllers.createdPosts);

router.delete('/', PostControllers.deletePost);

router.delete('/:id', PostControllers.deleteOnePost);

router.patch('/:id', PostControllers.updatePost);

module.exports = router;
