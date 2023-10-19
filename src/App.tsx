import React from "react";
import PdfViewerWithDraggable from "./PdfViewerWithDraggable";
import "./styles.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <div className="App">
    <header className="bg-light p-3 sticky-top border-bottom-custom">
    Sample react-doc-viewer with DraggableCard
</header>

      <PdfViewerWithDraggable />
    </div>
  );
};

export default App;
