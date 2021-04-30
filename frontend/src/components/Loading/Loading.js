import React from 'react';
import Loader from 'react-loader-spinner';

import './Loading.scss';

function Loading() {
  return (
    <Loader
      className="loading-spinner"
      type="Puff"
      color="#FFDA9F"
      height={100}
      width={100}
      timeout={50000}
    />
  );
}

export default Loading;
