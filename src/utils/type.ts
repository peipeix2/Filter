import { Timestamp } from 'firebase/firestore'

export interface CommentState {
  id: string
  author: string
  userId: string
  avatar: string
  comment: string
  comments_count: number
  created_at: Timestamp
  isPublic: boolean
  likes_count: number
  movie_id: number
  rating: number
  tags: string[]
  updated_at: Timestamp
  movie_title: string
  movie_original_title: string
  movie_backdrop_path: string
  movie_poster: string
  movie_release: string
  likesUser: string[]
}

export interface ReviewState {
  id: string
  title: string
  author: string
  userId: string
  avatar: string
  review: string
  comments_count: number
  created_at: Timestamp
  isPublic: boolean
  likes_count: number
  movie_id: number
  rating: number
  tags: string[]
  updated_at: Timestamp
  movie_title: string
  movie_original_title: string
  movie_backdrop_path: string
  movie_poster: string
  movie_release: string
  likesUser: string[]
}

export interface PostState {
  id: string
  title?: string
  author: string
  userId: string
  avatar: string
  review?: string
  comment?: string
  comments_count: number
  created_at: Timestamp
  isPublic: boolean
  likes_count: number
  movie_id: number
  rating: number
  tags: string[]
  updated_at: Timestamp
  movie_title: string
  movie_original_title: string
  movie_backdrop_path: string
  movie_poster: string
  movie_release: string
  likesUser: string[]
}

export interface UserCommentState {
  comment: string
  comments_count: number
  isPublic: boolean
  likes_count: number
  rating: number
}

export interface SubCommentState {
  id: string
  comment_id: string
  created_at: Timestamp
  subcomment: string
  updated_at: Timestamp
  userId: string
  username: string
}

export interface MovieFromFirestoreState {
  comments_count: number
  id: number
  original_title: string
  overview: string
  poster_path: string
  rating: number
  ratings_count: number
  release_date: string
  reviews_count: number
  tag: string[]
  title: string
  wishes_count: number
}

export interface MovieFromAPIState {
  id: number
  title: string
  original_title: string
  poster_path: string
  [key: string]: any
}

export interface UserProfileState {
  avatar: string
  backdrop: string
  email: string
  followers_count: number
  follows_count: number
  likes: string[]
  userId: string
  username: string
}

export interface FavoriteState {
  created_at: Timestamp
  movie_backdrop_path: string
  movie_id: string
  movie_original_title: string
  movie_poster: string
  movie_release: string
  movie_title: string
  schedule_time: string
  user: string
}

export interface FollowUserState {
  avatar: string
  userId: string
  username: string
}

export interface CastState {
  id: number
  name: string
  profile_path: string
  order: number
  character: string
  [key: string]: any
}
