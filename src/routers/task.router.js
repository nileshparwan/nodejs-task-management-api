const express = require('express');
const router = new express.Router();
const { auth } = require('../middleware/auth');
const taskControllers = require('../controllers/task.controller');

router.post("/tasks", auth, taskControllers.postTasks);
router.get("/tasks", auth, taskControllers.getTasks);
router.get("/tasks/:id", auth, taskControllers.getTasksById);
router.patch("/tasks/:id", auth, taskControllers.updateTask);
router.delete("/tasks/:id", auth, taskControllers.deleteTask);

module.exports = router;