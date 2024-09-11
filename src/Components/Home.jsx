import React from 'react'
import PropTypes from 'prop-types'

function Home(props) {
  return (
      <div className="card" >
          <div className="card bg-dark text-white border-0">
              <img src="../Assets/bg.jpeg" className="card-img" alt="Background" height="550px" />
                  <div className="card-img-overlay d-flex flex-column justify-content-center">
                      <div className="container">
                  <h5 className="card-title display-3 fw-bolder mb-0">Card title</h5>
                  <p className="card-text">
                      Some quick example text to build on the card title and make up the bulk of the card's content.
                  </p>
                  <p className="card-text">Last updated 3 mins ago</p>
                      </div>
              </div>
        </div>
      </div>
  )
}

Home.propTypes = {

}

export default Home

