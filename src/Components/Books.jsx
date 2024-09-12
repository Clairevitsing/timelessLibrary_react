import React, { useState, useEffect } from 'react';

const Books = () => {
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let componentMounted = true;
        const getBooks = async () => {
            setLoading(true);
            try {
                console.log("Fetching books...");
                const response = await fetch("http://127.0.0.1:8000/api/books");
                console.log("Response status:", response.status);
                if (componentMounted) {
                    const booksData = await response.json();
                    console.log("Books data received:", booksData);
                    setData(booksData);
                    setFilter(booksData);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching books:", error);
                setLoading(false);
            }
        };
        getBooks();
        return () => {
            componentMounted = false;
        };
    }, []);

    useEffect(() => {
        console.log("Current data state:", data);
        console.log("Current filter state:", filter);
    }, [data, filter]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="container">
                <div className="row">
                    <h1>Roman Policier</h1>
                    <div>
                        {filter.length > 0 ? (
                            filter.map((book, index) => (
                                <div key={index}>
                                    <h2>{book.title}</h2>
                                    <p>{book.description}</p>
                                </div>
                            ))
                        ) : (
                            <p>No books available (Filter length: {filter.length})</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Books;
