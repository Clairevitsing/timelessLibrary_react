import React, { useEffect, useState } from "react";
import { fetchRandomBookFromList } from "../../services/BookService";
import { Book } from "../../models/Book";
import { useNavigate } from "react-router-dom";
import styles from "./RandomBook.module.css"; 

const RandomBook: React.FC = () => {
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchRandomBookFromList()
            .then(setBook)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!book) return <div>No book found</div>;

    const handleDetailsClick = (id: number) => {
        navigate(`/books/${id}`);
    };

    return (
        <div className={`card mb-3 ${styles.cardContainer}`}>
            <div className="row g-0">
                {/* Book details description */}
                <div className={`col-md-6 ${styles.bookDetails}`}>
                    <h5 className={styles.bookTitle}>{book.title}</h5>
                    <p className={styles.bookDescription}>{book.description}</p>
                    
                    <div className="text-center mt-3">
                        <button className={styles.detailsButton} onClick={() => handleDetailsClick(book.id)}>
                            See Details
                        </button>
                    </div>
                </div>

                {/* Book image */}
                <div className={`col-md-6 ${styles.imageContainer}`}>
                    <img 
                        src={book.image || "/placeholder-book.jpg"} 
                        className={styles.bookImage} 
                        alt={book.title} 
                        onError={(e) => {
                            const imgElement = e.target as HTMLImageElement;
                            imgElement.src = "/placeholder-book.jpg";
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default RandomBook;

