const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User'); // ✅ ADD THIS
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/async');

// @desc    Get all projects for current user
// @route   GET /api/projects
// @access  Private
exports.getProjects = asyncHandler(async (req, res, next) => {
  const projects = await Project.find({
    $or: [{ owner: req.user.id }, { members: req.user.id }],
  }).populate('owner members');

  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects,
  });
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findOne({
    _id: req.params.id,
    $or: [{ owner: req.user.id }, { members: req.user.id }],
  }).populate('owner members');

  if (!project) {
    return next(new ErrorResponse(`Project not found`, 404));
  }

  res.status(200).json({ success: true, data: project });
});

// @desc    Create new project (Owner only)
// @route   POST /api/projects
// @access  Private (owner)
exports.createProject = asyncHandler(async (req, res, next) => {
  req.body.owner = req.user.id;

  const project = await Project.create(req.body);

  await User.findByIdAndUpdate(req.user.id, {
    $push: { projects: project._id },
  });

  res.status(201).json({ success: true, data: project });
});

// @desc    Update project (Owner only)
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = asyncHandler(async (req, res, next) => {
  let project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorResponse(`Project not found`, 404));
  }

  if (project.owner.toString() !== req.user.id) {
    return next(new ErrorResponse(`Not authorized`, 403));
  }

  project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: project });
});

// @desc    Delete project (Owner only)
exports.deleteProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorResponse(`Project not found`, 404));
  }

  if (project.owner.toString() !== req.user.id) {
    return next(new ErrorResponse(`Not authorized`, 403));
  }

  await Task.deleteMany({ project: project._id });

  await User.updateMany({ projects: project._id }, { $pull: { projects: project._id } });

  await project.remove();

  res.status(200).json({ success: true, data: {} });
});

// @desc    Join project (Members only)
// @route   POST /api/projects/join/:inviteCode
exports.joinProject = asyncHandler(async (req, res, next) => {
  if (req.user.role !== 'member') {
    return next(new ErrorResponse(`Only members can join projects`, 403));
  }

  const project = await Project.findOne({ inviteCode: req.params.inviteCode });

  if (!project) {
    return next(new ErrorResponse(`Invalid invite code`, 404));
  }

  if (project.members.includes(req.user.id) || project.owner.toString() === req.user.id) {
    return next(new ErrorResponse(`You are already part of this project`, 400));
  }

  project.members.push(req.user.id);
  await project.save();

  await User.findByIdAndUpdate(req.user.id, { $push: { projects: project._id } });

  res.status(200).json({ success: true, data: project });
});
