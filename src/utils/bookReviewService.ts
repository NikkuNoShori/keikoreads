import { BookReview } from "../types/BookReview";

// Mock data for development
const mockReviews: BookReview[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    review: "A timeless classic that explores the American Dream and its consequences. The prose is beautiful and the characters are unforgettable.",
    rating: 5,
    reviewDate: "2024-01-15",
    coverImage: "https://m.media-amazon.com/images/I/41hVn+QqQZL._SY445_SX342_.jpg",
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    review: "A powerful exploration of racial injustice and moral growth. Scout's perspective brings a unique innocence to the story.",
    rating: 5,
    reviewDate: "2024-02-01",
    coverImage: "https://m.media-amazon.com/images/I/51IXWZzlgSL._SY445_SX342_.jpg",
  },
  {
    id: "3",
    title: "1984",
    author: "George Orwell",
    review: "A chilling dystopian novel that remains relevant today. The themes of surveillance and government control are particularly striking.",
    rating: 4,
    reviewDate: "2024-02-15",
    coverImage: "https://m.media-amazon.com/images/I/51W1sBPO7tL._SY445_SX342_.jpg",
  },
];

export const bookReviewService = {
  getAllReviews: async (): Promise<BookReview[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockReviews;
  },

  getLatestReviews: async (limit: number = 3): Promise<BookReview[]> => {
    const reviews = await bookReviewService.getAllReviews();
    return reviews
      .sort((a, b) => new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime())
      .slice(0, limit);
  },

  getReviewById: async (id: string): Promise<BookReview | undefined> => {
    const reviews = await bookReviewService.getAllReviews();
    return reviews.find((review) => review.id === id);
  },
}; 