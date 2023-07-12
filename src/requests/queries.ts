export const queries = {
    users: {
        name: 'users',
        getAll: () => [queries.users.name],
        getOne: (userId: string) => [queries.users.name, { user: userId }],
        suggestion: () => [
            queries.users.name,
            { following: true, followers: true },
        ],
        querySearch: (q: string) => [
            queries.users.name,
            { query: { username: q } },
        ],
    },

    posts: {
        name: 'posts',
        getAll: () => [queries.posts.name],
        getOne: (postId: string) => [queries.posts.name, { post: postId }],
        followings: (currentUser: string) => [
            queries.posts.name,
            currentUser,
            { following: true },
        ],
    },
    comments: {
        name: 'comments',
        getAll: (postId: string) => [queries.comments.name, { post: postId }],
        getOne: (postId: string, commentId: string) => [
            queries.comments.name,
            { post: postId },
            { comment: commentId },
        ],
    },
}
