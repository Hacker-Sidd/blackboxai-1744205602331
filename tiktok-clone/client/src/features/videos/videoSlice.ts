import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import api from '../../api/api';
import { Video } from '../../types/video';

interface VideoState {
  videos: Video[];
  currentVideo: Video | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: VideoState = {
  videos: [],
  currentVideo: null,
  status: 'idle',
  error: null,
};

export const fetchVideos = createAsyncThunk(
  'videos/fetchVideos',
  async () => {
    const response = await api.get('/videos');
    return response.data;
  }
);

export const fetchVideoById = createAsyncThunk(
  'videos/fetchVideoById',
  async (id: string) => {
    const response = await api.get(`/videos/${id}`);
    return response.data;
  }
);

export const addComment = createAsyncThunk(
  'videos/addComment',
  async ({ videoId, text }: { videoId: string; text: string }) => {
    const response = await api.post(`/videos/${videoId}/comments`, { text });
    return response.data;
  }
);

export const selectCurrentVideo = (state: RootState) => state.videos.currentVideo;

const videoSlice = createSlice({
  name: 'videos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.videos = action.payload;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch videos';
      })
      .addCase(fetchVideoById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchVideoById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentVideo = action.payload;
      })
      .addCase(fetchVideoById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch video';
      });
  },
});

export default videoSlice.reducer;
