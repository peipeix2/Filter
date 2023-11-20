import { create } from 'zustand'

const useMoviesReviewStore = create((set) => ({
    moviesReview: {
        title: '',
        review: '',
        comments_count: 0,
        isPublic: true,
        likes_count: 0,
        rating: 0,
        tags: '',
    },
    setMoviesReview: (fieldName: any, value: any) => {
        set((state: any) => ({
            moviesReview: { ...state.moviesReview, [fieldName]: value },
        }))
    },
    resetMoviesReview: () => {
        set(() => ({
            moviesReview: {
                title: '',
                review: '',
                comments_count: 0,
                isPublic: true,
                likes_count: 0,
                rating: 0,
                tags: '',
            },
        }))
    },
    moviesReviewsForId: [],
    setMoviesReviewsForId: (moviesReviewsForId: any) =>
        set(() => ({ moviesReviewsForId: moviesReviewsForId }))
}))

export default useMoviesReviewStore
