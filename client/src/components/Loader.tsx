import React from 'react';

const Loader: React.FC = () => {
    return (
        <div className="loading-container">
            <img src="/Cookie.png" alt="Loading..." className="rolling-cookie" />
        </div>
    );
};

export default Loader;
