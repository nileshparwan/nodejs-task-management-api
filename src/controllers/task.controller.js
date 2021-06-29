const { Task } = require('../models/task');

exports.postTasks = async (req, res, next) => {
    // const task = new Task(req.body);
    const task = new Task({
        ...req.body,
        owner: req.user._id,
    });

    try {
        await task.save();
        res.status(201).send(task);
    } catch (err) {
        res.status(400).send({ ...err });
    }

    // task.save().then((data) => {
    //     res.status(201).send(data);
    // }).catch((err) => {
    //     res.status(400).send({ ...err });
    // });
};

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy= createdAt:asc | createdAt:desc
exports.getTasks = async (req, res, next) => {
    try {
        // method 1
        // const tasks = await Task.find({ owner: req.user._id });
        //  res.status(200).send(tasks);
        const match = {};
        const sort = {};

        if (req.query.completed) {
            match.completed = req.query.completed === "true";
        }

        if (req.query.sortBy) {
            // const parts = req.query.sortBy.split(":");
            // sort[part[0]].createdAt = part[1] === "desc" ? -1 : 1;
            sort["createdAt"] = req.query.sortBy.toLowerCase() === "desc" ? -1 : 1;
        }

        // method 2
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit), // mongoose will ignore if not a number, therefore adding safechech is not required
                skip: parseInt(req.query.skip),
                sort // sort: {} || ...sorting will not work
            }
        }).execPopulate();

        res.status(200).send(req.user.tasks);

    } catch (err) {
        res.status(400).send({ ...err });
    }

    // Task.find({}).then((tasks) => {
    //     res.status(200).send({ ...tasks });
    // }).catch((err) => {
    //     res.status(500).send({ ...err });
    // });
};

exports.getTasksById = async (req, res, next) => {
    const { id: _id = "" } = req.params;

    try {
        // let task = await Task.findById(_id);
        const task = await Task.findOne({ _id, owner: req.user._id });
        res.status(200).send(task);
    } catch (err) {
        res.status(500).send({ ...err });
    }

    // Task.findById(_id).then((tasks) => {
    //     if (!tasks) {
    //         return res.status(404).send();
    //     }
    //     res.send(tasks);
    // }).catch((err) => {
    //     res.status(500).send({ ...err });
    // });
};


exports.updateTask = async (req, res, next) => {
    const updates = Object.keys(req.body);
    const fields = ["description", "completed"];
    const isValidOperation = updates.every(update => fields.includes(update));
    const invalidField = !isValidOperation && updates.find(update => !fields.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: `Invalid field: ${invalidField}` });
    }

    try {
        const { id: _id = "" } = req.params;
        // const task = await Task.findById(_id);
        const task = await Task.findOne({ _id, owner: req.user._id });

        if (!task) {
            return res.status(404).send();
        }

        updates.forEach(update => task[update] = req.body[update]);
        await task.save();
        // const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
        res.send(task);
    } catch (err) {
        res.status(500).send({ ...err });
    }
};


exports.deleteTask = async (req, res, next) => {
    try {
        const { id: _id = "" } = req.params;
        // const task = await Task.findByIdAndDelete(_id);
        const task = await Task.findOneAndDelete({ _id, owner: req.user._id });

        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (err) {
        res.status(500).send({ ...err });
    }
};