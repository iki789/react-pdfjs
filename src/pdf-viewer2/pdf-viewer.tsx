import React, { Component } from "react";
import { Document, Page } from "react-pdf/dist/entry.webpack";
import "react-pdf/dist/Page/AnnotationLayer.css";

export default class PDFViewer extends Component {
  state = {
    numPages: null,
    pageNumber: 1
  };

  onDocumentLoadSuccess = (data: any) => {
    this.setState({ numPages: data.numPages });
  };

  render() {
    const { pageNumber, numPages } = this.state;
    return (
      <div>
        <Document
          onLoadSuccess={this.onDocumentLoadSuccess}
          file="http://localhost:3000/test.pdf"
          renderMode="canvas"
        >
          <Page pageNumber={2} renderMode="svg" renderTextLayer={true} />
          <p>
            Page {pageNumber} of {numPages}
          </p>
        </Document>
      </div>
    );
  }
}
