function Likes({ likes }: { likes: string[] }) {
    return likes.length > 0 ? (
        <button className="block font-semibold">{likes.length} likes</button>
    ) : null
}
export default Likes
