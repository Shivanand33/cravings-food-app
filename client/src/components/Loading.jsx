import React from "react";
import  loading from '../assets/loading.json'

const Loading = () => {
  return (
    <>
      <div className="w-full h-full">
        <img src={loading} alt="" className="w-40 h-40" />
      </div>
    </>
  );
};

export default Loading;