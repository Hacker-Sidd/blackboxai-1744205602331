export interface User {
  _id: string;
  username: string;
  avatar?: string;
}

export interface VideoComment {
  _id: string;
  text: string;
  user: User;
  createdAt: string;
}

export interface Video {
  _id: string;
  userId: string;
  user: {
    _id: string;
    username: string;
    avatar?: string;
  };
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  views: number;
  likes: string[];
  dislikes: string[];
  tags: string[];
  comments: VideoComment[];
  createdAt: string;
  updatedAt: string;
}

export interface VideoFormData {
  title: string;
  description: string;
  tags: string;
}
