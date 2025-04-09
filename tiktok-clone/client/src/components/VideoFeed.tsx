import React from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchVideos, selectCurrentVideo } from '../features/videos/videoSlice';
import type { Video } from '../types/video';

interface VideoFeedProps {
  videos?: Video[];
}

const VideoFeed: React.FC<VideoFeedProps> = () => {
  const dispatch = useAppDispatch();
  const { videos, status, error } = useAppSelector((state) => ({
    videos: state.videos.videos,
    status: state.videos.status,
    error: state.videos.error
  }));

  React.useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !== 
        document.documentElement.offsetHeight || 
        status !== 'idle'
      ) {
        return;
      }
      dispatch(fetchVideos());
    };

    if (status === 'idle') {
      dispatch(fetchVideos());
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [status, dispatch]);

  if (status === 'loading' && videos.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="text-red-500 text-center p-4">
        Error loading videos: {error}
        <button 
          onClick={() => dispatch(fetchVideos())}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        No videos found. Be the first to upload!
      </div>
    );
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
              {video.user && (
                <>
                  <img 
                    src={video.user.avatar || '/default-avatar.png'} 
                    alt={video.user.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <h3 className="font-medium text-sm line-clamp-2">{video.title}</h3>
                    <p className="text-gray-500 text-xs">{video.user.username}</p>
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>{video.views} views</span>
              <span>{video.likes.length} likes</span>
            </div>
          </div>
        </div>
      ))}
      {status === 'loading' && videos.length > 0 && (
        <div className="col-span-full flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default VideoFeed;
