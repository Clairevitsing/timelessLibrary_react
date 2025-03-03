import React, { useEffect, useState } from "react";
import { fetchRandomBookFromList } from "../../services/BookService";
import { Book } from "../../models/Book";
import { useNavigate } from "react-router-dom";

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
        // Navigate to the book detail page
        navigate(`/books/${id}`);
    };
    
    return (
        <div className="card mb-3">
            <div className="row g-0">
                {/* Book details description */}
                <div className="col-md-6 d-flex flex-column justify-content-center p-5">
                    <h5 className="card-title text-center">{book.title}</h5>
                    <p className="card-text text-justify">{book.description}</p>
                    {/* <p className="card-text">
                        {book.authors.map(author => (
                            <div key={author.id} className="text-center">{author.firstName} {author.lastName}</div>
                        ))}
                    </p> */}
                    <div className="text-center mt-3">
                        <button className="btn btn-primary mt-2" onClick={() => handleDetailsClick(book.id)}>See Details</button>
                    </div>
                </div>

                {/* book image*/}
                <div className="col-md-6 d-flex justify-content-center align-items-center">
                    <img 
                        src={book.image} 
                        className="img-fluid rounded" 
                        alt={book.title} 
                        style={{ maxHeight: "320px", width: "auto" }} 
                    />
                </div>
            </div>
        </div>


    );
};

export default RandomBook;
