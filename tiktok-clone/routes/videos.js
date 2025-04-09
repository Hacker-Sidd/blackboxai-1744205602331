const router = require('express').Router();
const Video = require('../models/Video');
const verifyToken = require('../middleware/verifyToken');

// Create a video
router.post('/', verifyToken, async (req, res) => {
  try {
    const newVideo = new Video({
      userId: req.user.id,
      ...req.body
    });
    const savedVideo = await newVideo.save();
    res.status(201).json(savedVideo);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update video
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (video.userId === req.user.id) {
      const updatedVideo = await Video.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedVideo);
    } else {
      res.status(403).json('You can update only your videos');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete video
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (video.userId === req.user.id) {
      await Video.findByIdAndDelete(req.params.id);
      res.status(200).json('Video has been deleted');
    } else {
      res.status(403).json('You can delete only your videos');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get video
router.get('/find/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    res.status(200).json(video);
  } catch (err) {
    res.status(500).json(err);
  }
});

// View video (increment view count)
router.put('/view/:id', async (req, res) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 }
    });
    res.status(200).json('The view has been increased');
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get trending videos
router.get('/trend', async (req, res) => {
  try {
    const videos = await Video.find().sort({ views: -1 }).limit(20);
    res.status(200).json(videos);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get random videos
router.get('/random', async (req, res) => {
  try {
    const videos = await Video.aggregate([{ $sample: { size: 20 } }]);
    res.status(200).json(videos);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get videos by user
router.get('/user/:userId', async (req, res) => {
  try {
    const videos = await Video.find({ userId: req.params.userId });
    res.status(200).json(videos);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Like/Unlike video
router.put('/like/:videoId', verifyToken, async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);
    if (!video.likes.includes(req.user.id)) {
      await video.updateOne({ $push: { likes: req.user.id } });
      res.status(200).json('The video has been liked');
    } else {
      await video.updateOne({ $pull: { likes: req.user.id } });
      res.status(200).json('The video has been unliked');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
