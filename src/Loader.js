import React from "react";
import "./Loader.css"; // CSS alag rakho

export default function Loader() {
  return (
    <div className="loader-overlay">
      <div className="loadingio-spinner-gear">
        <div className="ldio">
          <div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
      </div>
    </div>
  );
}
