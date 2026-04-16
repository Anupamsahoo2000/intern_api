const express = require('express');
const { getTasks, getTask, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// basic crud for tasks
router.get('/', authMiddleware, getTasks);
router.get('/:id', authMiddleware, getTask);
router.post('/', authMiddleware, createTask);
router.put('/:id', authMiddleware, updateTask);
router.delete('/:id', authMiddleware, deleteTask);

module.exports = router;
