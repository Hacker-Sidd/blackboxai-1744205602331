const router = require('express').Router();
const Comment = require('../models/Comment');
const verifyToken = require('../middleware/verifyToken');

// Create comment
router.post('/', verifyToken, async (req, res) => {
  try {
    const newComment = new Comment({
      userId: req.user.id,
      ...req.body
    });
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get video comments
router.get('/:videoId', async (req, res) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId })
      .sort({ createdAt: -1 })
      .populate('userId', 'username profilePicture');
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete comment
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (comment.userId.toString() === req.user.id) {
      await Comment.findByIdAndDelete(req.params.id);
      res.status(200).json('Comment has been deleted');
    } else {
      res.status(403).json('You can delete only your comments');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Like/Unlike comment
router.put('/like/:commentId', verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment.likes.includes(req.user.id)) {
      await comment.updateOne({ $push: { likes: req.user.id } });
      res.status(200).json('The comment has been liked');
    } else {
      await comment.updateOne({ $pull: { likes: req.user.id } });
      res.status(200).json('The comment has been unliked');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Add reply to comment
router.put('/reply/:commentId', verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        $push: {
          replies: {
            userId: req.user.id,
            text: req.body.text
          }
        }
      },
      { new: true }
    );
    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
