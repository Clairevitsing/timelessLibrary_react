import React from "react";
import NewBooks from "../../components/NewBooks/NewBooks";
import RandomBook from "../../components/RandomBook/RandomBook";
import LibraryServices from "../../components/LibraryServices/LibraryServices";
import "./HomePage.css"; 

const HomePage: React.FC = () => {
  return (
    <div className="homepage container mt-4">
      <RandomBook />
      <NewBooks />
      <LibraryServices />
    </div>
  );
};

export default HomePage;
