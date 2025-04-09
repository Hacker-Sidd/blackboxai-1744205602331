const router = require('express').Router();
const User = require('../models/User');
const verifyToken = require('../middleware/verifyToken');

// Get user
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update user
router.put('/:id', verifyToken, async (req, res) => {
  if (req.user.id === req.params.id) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      ).select('-password');
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json('You can update only your account!');
  }
});

// Follow user
router.put('/:id/follow', verifyToken, async (req, res) => {
  if (req.user.id !== req.params.id) {
    try {
      const userToFollow = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user.id);

      if (!userToFollow.followers.includes(req.user.id)) {
        await userToFollow.updateOne({ $push: { followers: req.user.id } });
        await currentUser.updateOne({ $push: { following: req.params.id } });
        res.status(200).json('User has been followed');
      } else {
        res.status(403).json('You already follow this user');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json('You cant follow yourself');
  }
});

// Unfollow user
router.put('/:id/unfollow', verifyToken, async (req, res) => {
  if (req.user.id !== req.params.id) {
    try {
      const userToUnfollow = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user.id);

      if (userToUnfollow.followers.includes(req.user.id)) {
        await userToUnfollow.updateOne({ $pull: { followers: req.user.id } });
        await currentUser.updateOne({ $pull: { following: req.params.id } });
        res.status(200).json('User has been unfollowed');
      } else {
        res.status(403).json('You dont follow this user');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json('You cant unfollow yourself');
  }
});

module.exports = router;
