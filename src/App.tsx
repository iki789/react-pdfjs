import React from "react";
import "./App.css";
import PDFViewer from "./pdf-viewer/pdf-viewer";

export default class App extends React.Component {
  state = {};
  pdf: any;
  pdfUrl: string =
    "https://www.tdcanadatrust.com/document/PDF/accessibility/tdct-accessibility-3515-privacy-code-lp.pdf";

  componentDidMount() {
    fetch("https://cors-anywhere.herokuapp.com/" + this.pdfUrl, {
      headers: {
        "content-type": "application/pdf"
      },
      credentials: "omit",
      mode: "cors"
    })
      .then(res => res.arrayBuffer())
      .then(buff => {
        this.pdf = <PDFViewer src={buff} keywords="privacy policy"></PDFViewer>;
        this.setState({ ...this.state });
      });
  }

  render() {
    return <div className="App">{this.pdf}</div>;
  }
}
