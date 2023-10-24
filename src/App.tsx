import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./component/Home";
import DocumentViewer from "./component/DocumentViewer";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";


const App = () => {
  return (

      <Router>
        <div className="App">
          <header className="bg-light p-3 sticky-top border-bottom-custom">
            Sample react-doc-viewer with DraggableCard
          </header>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/document/:id" element={<DocumentViewer />} />
          </Routes>
        </div>
      </Router>

  );
};

export default App;
