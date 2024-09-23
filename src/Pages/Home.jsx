import React from 'react';
import HomeBanner from '../Components/HomeBanner/HomeBanner';
import './CSS/Home.css';
import RecentBooks from '../Components/RecentBooks/RecentBooks';


const Home = () => {
  return (
    <div className="home-container">
      <HomeBanner />
      <RecentBooks />
    </div>
  );
};

export default Home;