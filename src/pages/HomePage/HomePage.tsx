import React from 'react';
import  NewBooks  from '../../components/NewBooks/NewBooks'
import RandomBook from "../../components/RandomBook/RandomBook";
import LibraryServices from "../../components/LibraryServices/LibraryServices";
interface Props {
    
}

const HomePage = (props: Props) => {
    return (
        <div className="container mt-4">
            <RandomBook />
            
            <NewBooks />

            <LibraryServices />
        </div>
    )
}


export default HomePage;