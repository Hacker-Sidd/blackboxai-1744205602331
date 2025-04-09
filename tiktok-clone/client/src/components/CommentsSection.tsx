import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { VideoComment, Video } from '../types/video';
import { addComment } from '../features/videos/videoSlice';
import api from '../api/api';

const CommentsSection = () => {
  const { id: videoId } = useParams();
  const [commentText, setCommentText] = useState('');
  const { currentVideo } = useAppSelector(state => state.videos);
  const comments: VideoComment[] = currentVideo?.comments || [];
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !videoId) return;

    try {
      await dispatch(addComment({ videoId, text: commentText }));
      setCommentText('');
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
  };

  return (
    <div className="comments-section mt-4 p-4 border-t">
      <h3 className="text-xl font-semibold mb-4">Comments ({comments.length})</h3>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          className="w-full p-2 border rounded"
          rows={3}
        />
        <button 
          type="submit" 
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Post Comment
        </button>
      </form>

      <div className="comments-list space-y-4">
        {comments.map((comment: VideoComment) => (
          <div key={comment._id} className="comment p-3 bg-gray-50 rounded">
            <div className="flex items-center mb-2">
              <img 
                src={comment.user?.avatar || '/default-avatar.png'} 
                alt={comment.user?.username}
                className="w-8 h-8 rounded-full mr-2"
              />
              <span className="font-medium">{comment.user?.username}</span>
            </div>
            <p>{comment.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;
