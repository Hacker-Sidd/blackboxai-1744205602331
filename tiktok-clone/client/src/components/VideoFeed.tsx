import React from 'react';
import { Video } from '../types/video';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchVideos } from '../features/videos/videoSlice';

interface VideoFeedProps {
  videos?: Video[];
}

const VideoFeed: React.FC<VideoFeedProps> = () => {
  const dispatch = useAppDispatch();
  const { videos, status, error } = useAppSelector(state => state.videos);

  React.useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchVideos());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === 'failed') {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {videos?.map((video) => (
        <div key={video._id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative pb-[56.25%]"> {/* 16:9 aspect ratio */}
            <video
              src={video.videoUrl}
              className="absolute top-0 left-0 w-full h-full object-cover"
              muted
              loop
              preload="metadata"
            />
          </div>
          <div className="p-3">
            <div className="flex items-start space-x-2">
              <img 
                src={video.user?.avatar || '/default-avatar.png'} 
                alt={video.user?.username}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <h3 className="font-medium text-sm line-clamp-2">{video.title}</h3>
                <p className="text-gray-500 text-xs">{video.user?.username}</p>
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>{video.views} views</span>
              <span>{video.likes.length} likes</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoFeed;
