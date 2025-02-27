import React from "react";
import NewBooks from "../../components/NewBooks/NewBooks";
import RandomBook from "../../components/RandomBook/RandomBook";
import LibraryServices from "../../components/LibraryServices/LibraryServices";
import Footer from "../../components/Footer/Footer";
import "./HomePage.css"; 

const HomePage: React.FC = () => {
  return (
    <div className="homepage container mt-4">
      <RandomBook />
      <NewBooks />
      <LibraryServices />
      <Footer />
    </div>
  );
};

export default HomePage;
