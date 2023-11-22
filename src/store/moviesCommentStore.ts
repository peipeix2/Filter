import { create } from 'zustand'

interface MoviesCommentState {
    comment: string;
    comments_count: number,
    isPublic: boolean,
    likes_count: number,
    rating: number,
}

interface MoviesCommentsForIdState {
    author: string;
    avatar: string;
    comment: string;
    comments_count: number,
    created_at: Date,
    isPublic: boolean,
    likes_count: number,
    movie_id: number,
    rating: number,
    tags: string[],
    updated_at: Date
}

interface MoviesCommentsStoreState {
    moviesComment: MoviesCommentState;
    setMoviesComment: (fieldName: string, value: any) => void;
    resetMoviesComment: () => void;
    moviesCommentsForId: MoviesCommentsForIdState[];
    setMoviesCommentsForId: (moviesCommentsForId: MoviesCommentsForIdState) => void;
}

const useMoviesCommentStore = create<MoviesCommentsStoreState>((set) => ({
    moviesComment: {
        comment: '',
        comments_count: 0,
        isPublic: true,
        likes_count: 0,
        rating: 0,
    },
    setMoviesComment: (fieldName, value) => {
        set((state) => ({
            moviesComment: { ...state.moviesComment, [fieldName]: value },
        }))
    },
    resetMoviesComment: () => {
        set(() => ({
            moviesComment: {
                comment: '',
                comments_count: 0,
                isPublic: true,
                likes_count: 0,
                rating: 0,
            },
        }))
    },
    moviesCommentsForId: [],
    setMoviesCommentsForId: (moviesCommentsForId:any) =>
        set(() => ({ moviesCommentsForId: moviesCommentsForId })),
}))

export default useMoviesCommentStore
