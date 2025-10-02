import { useState } from "react";
import axios from "axios";

export default function ReviewForm({ serviceProviderId, token, onReviewAdded }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `/api/serviceProvider/${serviceProviderId}/review`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onReviewAdded(res.data.reviews);
      setComment("");
      setRating(5);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <label>Rating:</label>
      <select value={rating} onChange={(e) => setRating(e.target.value)}>
        {[1, 2, 3, 4, 5].map((num) => (
          <option key={num} value={num}>{num}</option>
        ))}
      </select>

      <label>Comment:</label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Review"}
      </button>
    </form>
  );
}