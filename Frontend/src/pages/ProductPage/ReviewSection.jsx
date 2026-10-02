import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { useFirebase } from "@/context/FirebaseContext";
import { db } from "@/context/FirebaseConfig";

const ReviewSection = ({ productId }) => {
  const { user } = useFirebase();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const q = query(
        collection(db, "reviews"),
        where("productId", "==", productId)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReviews(data);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    }
  };

  const updateProductStats = async () => {
    try {
      const q = query(
        collection(db, "reviews"),
        where("productId", "==", productId)
      );
      const snapshot = await getDocs(q);
      const reviewList = snapshot.docs.map((doc) => doc.data());

      const totalRating = reviewList.reduce((sum, r) => sum + (r.rating || 0), 0);
      const avgRating =
        reviewList.length > 0 ? totalRating / reviewList.length : 0;

      const productRef = doc(db, "products", productId);
      await updateDoc(productRef, {
        rating: parseFloat(avgRating.toFixed(1)),
        reviews: reviewList.length,
      });
    } catch (err) {
      console.error("Failed to update product stats", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please log in to leave a review.");
    if (rating === 0 || !comment.trim()) {
      return alert("Please provide a rating and a comment.");
    }

    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const username = userSnap.exists()
        ? userSnap.data().username || user.email || "Anonymous"
        : user.email || "Anonymous";

      const reviewData = {
        productId,
        userId: user.uid,
        username,
        rating,
        comment,
        createdAt: Timestamp.now(),
      };

      if (editingReviewId) {
        const reviewRef = doc(db, "reviews", editingReviewId);
        await updateDoc(reviewRef, reviewData);
        setEditingReviewId(null);
      } else {
        await addDoc(collection(db, "reviews"), reviewData);
      }

      setRating(0);
      setComment("");
      fetchReviews();
      updateProductStats();
    } catch (err) {
      console.error("Failed to submit review", err);
    }
  };

  const handleEdit = (review) => {
    setRating(review.rating);
    setComment(review.comment);
    setEditingReviewId(review.id);
  };

  const handleDelete = async (reviewId) => {
    try {
      await deleteDoc(doc(db, "reviews", reviewId));
      fetchReviews();
      updateProductStats();
    } catch (err) {
      console.error("Failed to delete review", err);
    }
  };

  return (
    <div className="mt-8 border-t pt-6 max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold border-b pb-2">Customer Reviews</h2>

      <div className="space-y-6 mt-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="p-4 border rounded-lg shadow-md">
              <h3 className="font-semibold text-black">{review.username}</h3>
              <div className="flex items-center space-x-1 mt-1 text-yellow-500">
                {[...Array(5)].map((_, index) => (
                  <span key={index}>{index < review.rating ? "★" : "☆"}</span>
                ))}
              </div>
              <p className="text-black mt-2 italic">{review.comment}</p>
              <p className="text-xs text-gray-500">
                {review.createdAt?.toDate().toLocaleString()}
              </p>
              {user && review.userId === user.uid && (
                <div className="mt-2 space-x-4 text-sm">
                  <button
                    onClick={() => handleEdit(review)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">
            No reviews yet. Be the first to review!
          </p>
        )}
      </div>

      {user && (
        <div className="mt-8 p-6">
          <h3 className="text-lg font-semibold">
            {editingReviewId ? "Edit Your Review" : "Write a Review"}
          </h3>
          <div className="flex space-x-2 mt-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`text-3xl transition transform hover:scale-110 ${
                  star <= rating ? "text-yellow-500" : "text-gray-500"
                }`}
                onClick={() => setRating(star)}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            placeholder="Write a review..."
            className="w-full p-4 border rounded-lg mt-4 focus:ring-2 focus:ring-gray-500 focus:outline-none"
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="px-6 py-3 mt-4 bg-primary text-white rounded-lg font-semibold"
            onClick={handleSubmit}
          >
            {editingReviewId ? "Update Review" : "Submit Review"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
