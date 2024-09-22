import React from 'react';
import bgImage from '../Assets/bg.jpg';

function HomeBanner() {
    return (
        <div className="hero">
            <div className="card bg-dark text-white border-0">
                <img src={bgImage} className="card-img" alt="Background" style={{height: "550px", objectFit: "cover"}} />
                <div className="card-img-overlay d-flex flex-column justify-content-center">
                    <div className="container">
                        <h5 className="card-title display-3 fw-bolder mb-0">Card title</h5>
                        <p className="card-text lead fs-2">
                            Some quick example text to build on the card title and make up the bulk of the card's content.
                        </p>
                        <p className="card-text">Last updated 3 mins ago</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeBanner;

