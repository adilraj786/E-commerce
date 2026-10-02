import React, { useState, useEffect } from "react";
import { db } from "@/context/FirebaseConfig";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  getDoc,
  doc as firestoreDoc,
} from "firebase/firestore";
import { useFirebase } from "@/context/FirebaseContext";

const ReviewSection = ({ productId }) => {
  const { currentUser } = useFirebase();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (!productId) return;

    const reviewsQuery = query(
      collection(db, "reviews"),
      where("productId", "==", productId)
    );

    const unsubscribe = onSnapshot(reviewsQuery, async (snapshot) => {
      const fetchedReviews = await Promise.all(
        snapshot.docs.map(async (reviewDoc) => {
          const reviewData = reviewDoc.data();
          const userRef = firestoreDoc(db, "users", reviewData.userId);
          const userSnap = await getDoc(userRef);
          return {
            id: reviewDoc.id,
            userName: userSnap.exists() ? userSnap.data().name : "Anonymous",
            ...reviewData,
          };
        })
      );
      setReviews(fetchedReviews);
    });

    return () => unsubscribe();
  }, [productId]);

  useEffect(() => {
    if (currentUser) {
      const fetchUserName = async () => {
        const userRef = firestoreDoc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) setUserName(userSnap.data().name);
      };
      fetchUserName();
    }
  }, [currentUser]);

  const handleSubmitReview = async () => {
    if (!productId || rating === 0 || !comment.trim()) {
      alert("Please provide a rating and a comment.");
      return;
    }
    try {
      await addDoc(collection(db, "reviews"), {
        productId,
        userId: currentUser.uid,
        rating,
        comment,
        timestamp: serverTimestamp(),
      });
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  return (
    <div className="mt-8 border-t pt-6 max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold  border-b pb-2">Customer Reviews</h2>

      <div className="space-y-6 mt-4">
        {reviews.length > 0 ? (
          reviews.map(({ id, userName, rating, comment }) => (
            <div key={id} className="p-4 border rounded-lg shadow-md">
              <h3 className="font-semibold text-white">{userName}</h3>
              <div className="flex items-center space-x-1 mt-1 text-yellow-500">
                {[...Array(5)].map((_, index) => (
                  <span key={index}>{index < rating ? "★" : "☆"}</span>
                ))}
              </div>
              <p className="text-black mt-2 italic">{comment}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">
            No reviews yet. Be the first to review!
          </p>
        )}
      </div>

      {currentUser && (
        <div className="mt-8 p-6 ">
          <h3 className="text-lg font-semibold ">Write a Review</h3>
          <div className="flex space-x-2 mt-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
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
            className="px-6 py-3 mt-4 bg-primary text-white rounded-lg font-semibold "
            onClick={handleSubmitReview}
          >
            Submit Review
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
