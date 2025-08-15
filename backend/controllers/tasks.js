const Task = require('../models/Task');
const Project = require('../models/Project');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/async');
const { getIO } = require('../config/socket');

// @desc    Get all tasks for a project
// @route   GET /api/projects/:projectId/tasks
// @access  Private
exports.getTasks = asyncHandler(async (req, res, next) => {
  // Check if user has access to the project
  const project = await Project.findOne({
    _id: req.params.projectId,
    $or: [
      { owner: req.user.id },
      { members: req.user.id },
    ],
  });

  if (!project) {
    return next(
      new ErrorResponse(`Not authorized to access tasks for project ${req.params.projectId}`, 401)
    );
  }

  const tasks = await Task.find({ project: req.params.projectId })
    .populate('assignee')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks,
  });
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id).populate('assignee');

  if (!task) {
    return next(
      new ErrorResponse(`Task not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if user has access to the project
  const project = await Project.findOne({
    _id: task.project,
    $or: [
      { owner: req.user.id },
      { members: req.user.id },
    ],
  });

  if (!project) {
    return next(
      new ErrorResponse(`Not authorized to access this task`, 401)
    );
  }

  res.status(200).json({
    success: true,
    data: task,
  });
});

// @desc    Create new task
// @route   POST /api/projects/:projectId/tasks
// @access  Private
exports.createTask = asyncHandler(async (req, res, next) => {
  // Check if user has access to the project
  const project = await Project.findOne({
    _id: req.params.projectId,
    $or: [
      { owner: req.user.id },
      { members: req.user.id },
    ],
  });

  if (!project) {
    return next(
      new ErrorResponse(`Not authorized to create tasks for project ${req.params.projectId}`, 401)
    );
  }

  // Add project to req.body
  req.body.project = req.params.projectId;
  req.body.reporter = req.user.id; // ✅ Automatically set reporter
  
  const task = await Task.create(req.body);

  // Emit socket event
  const io = getIO();
  io.to(req.params.projectId).emit('taskCreated', task);

  res.status(201).json({
    success: true,
    data: task,
  });
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = asyncHandler(async (req, res, next) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return next(
      new ErrorResponse(`Task not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if user has access to the project
  const project = await Project.findOne({
    _id: task.project,
    $or: [
      { owner: req.user.id },
      { members: req.user.id },
    ],
  });

  if (!project) {
    return next(
      new ErrorResponse(`Not authorized to update this task`, 401)
    );
  }

  // Check if user is task assignee or project owner
  if (
    task.assignee?.toString() !== req.user.id &&
    project.owner.toString() !== req.user.id
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this task`,
        401
      )
    );
  }

  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('assignee');

  // Emit socket event
  const io = getIO();
  io.to(task.project.toString()).emit('taskUpdated', task);

  res.status(200).json({
    success: true,
    data: task,
  });
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(
      new ErrorResponse(`Task not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if user has access to the project
  const project = await Project.findOne({
    _id: task.project,
    $or: [
      { owner: req.user.id },
      { members: req.user.id },
    ],
  });

  if (!project) {
    return next(
      new ErrorResponse(`Not authorized to delete this task`, 401)
    );
  }

  // Check if user is task assignee or project owner
  if (
    task.assignee?.toString() !== req.user.id &&
    project.owner.toString() !== req.user.id
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this task`,
        401
      )
    );
  }

  await task.remove();

  // Emit socket event
  const io = getIO();
  io.to(task.project.toString()).emit('taskDeleted', task._id);

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
exports.addComment = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(
      new ErrorResponse(`Task not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if user has access to the project
  const project = await Project.findOne({
    _id: task.project,
    $or: [
      { owner: req.user.id },
      { members: req.user.id },
    ],
  });

  if (!project) {
    return next(
      new ErrorResponse(`Not authorized to comment on this task`, 401)
    );
  }

  const comment = {
    user: req.user.id,
    text: req.body.text,
  };

  task.comments.push(comment);
  await task.save();

  // Emit socket event
  const io = getIO();
  io.to(task.project.toString()).emit('commentAdded', {
    taskId: task._id,
    comment,
  });

  res.status(200).json({
    success: true,
    data: task,
  });
});