import React from 'react';
import './HomePage.css';

const RenderImage = ({ imageData }) => {
    const imageSrc = `data:image/png;base64,${imageData}`;

    return (
        <div className="image-container">
            <img src={imageSrc} alt="Prediction Result" className="responsive-image" />
        </div>
    );
};

export default RenderImage;
