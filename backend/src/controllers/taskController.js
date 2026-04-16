const Task = require('../models/Task');

const getTasks = async (req, res) => {
    try {
        let tasks = [];
        if (req.user.role === 'admin') {
            tasks = await Task.findAll(); // admins see everything
        } else {
            tasks = await Task.findAll({ where: { userId: req.user.id } });
        }
        res.json(tasks);
    } catch (err) {
        console.error("fetch tasks error: ", err);
        res.status(500).json({ error: "something went wrong" });
    }
};

const getTask = async (req, res) => {
    try {
        const t = await Task.findByPk(req.params.id);

        if (!t) return res.status(404).json({ error: "Task not found" });

        if (t.userId !== req.user.id && req.user.role !== 'admin') {
             return res.status(403).json({ error: "unauthorized" });
        }

        res.json(t);
    } catch (e) {
        console.log(e);
        res.status(500).send("server error");
    }
};

const createTask = async (req, res) => {
    try {
        if (!req.body.title) {
            return res.status(400).send("Title is mandatory");
        }

        const newTask = await Task.create({
            title: req.body.title,
            description: req.body.description || null,
            status: req.body.status || 'pending',
            userId: req.user.id
        });

        res.status(201).json(newTask);
    } catch (err) {
        console.log("create task failed", err);
        res.status(500).json({ message: "failed to create task" });
    }
};

const updateTask = async (req, res) => {
    try {
        let t = await Task.findByPk(req.params.id);

        if (!t) return res.status(404).send("task not found!");

        if (t.userId !== req.user.id && req.user.role !== 'admin') {
             return res.status(403).send("you don't own this task");
        }

        t = await t.update(req.body);
        res.json(t);
    } catch (err) {
        console.log(err);
        res.status(500).send("error updating task");
    }
};

const deleteTask = async (req, res) => {
    try {
        const t = await Task.findByPk(req.params.id);

        if (!t) return res.status(404).json({ msg: "task doesn't exist" });

        if (t.userId !== req.user.id && req.user.role !== 'admin') {
             return res.status(403).send("Not authorized");
        }

        await t.destroy();
        res.json({ message: "deleted successfully" });
    } catch (err) {
        res.status(500).send("Error deleting");
    }
};

module.exports = {
    getTasks, getTask, createTask, updateTask, deleteTask
};
