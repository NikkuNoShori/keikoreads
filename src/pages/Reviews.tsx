import { useEffect, useState } from "react";
import { BookReview } from "../types/BookReview";
import { bookReviewService } from "../utils/bookReviewService";

export const Reviews = () => {
  const [reviews, setReviews] = useState<BookReview[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const allReviews = await bookReviewService.getAllReviews();
      setReviews(allReviews);
    };
    fetchReviews();
  }, []);

  return (
    <div className="w-full">
      <h1 className="text-4xl font-bold mb-8">Book Reviews</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          >
            <h2 className="text-2xl font-semibold mb-2">{review.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              by {review.author}
            </p>
            <p className="text-gray-700 dark:text-gray-200 mb-4">
              {review.review}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(review.reviewDate).toLocaleDateString()}
              </span>
              <span className="text-sm font-medium">
                Rating: {review.rating}/5
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 