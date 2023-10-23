import React from "react";
import { Link } from "react-router-dom";

import documents from "../documents";

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <h1 className="mb-4">Home</h1>
      <ul className="list-group list-file-group">
        {documents.map((doc) => (
           <li key={doc.id} className="list-group-item list-file">
     <Link to={`/document/${doc.id}`} className="text-decoration-none">{doc.name}</Link>

          </li>
        ))}
      </ul>
    </div>
  );
};
export default Home;
