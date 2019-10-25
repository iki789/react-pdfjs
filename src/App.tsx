import React from "react";
import "./App.css";
import PDFViewer from "./pdf-viewer/pdf-viewer";

const App: React.FC = () => {
  return (
    <div className="App">
      <PDFViewer src="http://localhost:3000/test.pdf"></PDFViewer>
    </div>
  );
};

export default App;
