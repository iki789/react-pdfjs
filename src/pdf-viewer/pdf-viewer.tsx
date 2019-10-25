import React, { Component, RefObject } from "react";
import "./pdf-viewer.css";
import Paper from "./paper/paper";
const pdfjs = require("pdfjs-dist");
const pdfjsWorker = require("pdfjs-dist/build/pdf.worker.entry");

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default class PDFViewer extends Component<PDFViewerProps> {
  canvasRef: RefObject<HTMLCanvasElement> = React.createRef();
  src: string = this.props.src;
  pages: number = 1;
  state = {
    scale: 1.7
  };
  PDFdocumentRef: any;

  fetchPdf = async () => {
    if (!this.PDFdocumentRef) {
      this.PDFdocumentRef = pdfjs.getDocument(this.src).promise;
      const { numPages } = await this.PDFdocumentRef;
      this.pages = numPages;
      this.setState({ pages: numPages });
    }
    return this.PDFdocumentRef;
  };

  loadPages = () => {
    let pages = [];
    for (let i = 1; i <= this.pages; i++) {
      pages.push(
        <Paper
          key={"page#" + i}
          documentLoadRef={this.fetchPdf()}
          page={i}
          scale={this.state.scale}
        ></Paper>
      );
    }
    return pages;
  };

  render() {
    return <div className="pdf-bg">{this.loadPages().map(page => page)}</div>;
  }
}

interface PDFViewerProps {
  src: string;
}
