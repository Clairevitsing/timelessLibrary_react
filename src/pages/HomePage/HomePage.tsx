import React from 'react';
import  NewBooks  from '../../components/NewBooks/NewBooks'
import RandomBook from "../../components/RandomBook/RandomBook";
interface Props {
    
}

const HomePage = (props: Props) => {
    return (
        <div className="container mt-4">
            <RandomBook />

            <NewBooks />
        </div>
    )
}


export default HomePage;