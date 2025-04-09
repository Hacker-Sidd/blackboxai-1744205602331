import React from 'react';
import { useParams } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import CommentsSection from '../components/CommentsSection';

const VideoDetail = () => {
  const { id } = useParams();

  return (
    <div className="video-detail">
      <VideoPlayer videoId={id} />
      <CommentsSection videoId={id} />
    </div>
  );
};

export default VideoDetail;
