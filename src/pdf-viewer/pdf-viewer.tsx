import React, { Component, RefObject } from "react";
import "./pdf-viewer.css";
import Paper from "./paper/paper";
import mark from "mark.js";
const pdfjs = require("pdfjs-dist");
const pdfjsWorker = require("pdfjs-dist/build/pdf.worker.entry");

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default class PDFViewer extends Component<PDFViewerProps> {
  canvasRef: RefObject<HTMLCanvasElement> = React.createRef();
  src: string = this.props.src;
  pages: number = 1;
  container: RefObject<HTMLDivElement> = React.createRef();
  keyWords: string = "Logitech";
  PDFdocumentRef: any;
  fullyRenderedPages: number = 0;
  state = {
    scale: 1
  };

  fetchPdf = async () => {
    if (!this.PDFdocumentRef) {
      this.PDFdocumentRef = pdfjs.getDocument(this.src).promise;
      const { numPages } = await this.PDFdocumentRef;
      this.pages = numPages;
      this.setState({ pages: numPages });
      document.addEventListener(
        "textlayerrendered",
        () => {
          this.fullyRenderedPages = this.fullyRenderedPages + 1;
          if (this.fullyRenderedPages === numPages) {
            this.markKeywords(this.keyWords);
          }
        },
        true
      );
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

  markKeywords = (keyWords: string) => {
    if (this.container.current) {
      const markI = new mark(this.container.current);
      markI.mark(keyWords, {
        acrossElements: true
      });
    }
  };

  render() {
    return (
      <div className="pdf-bg" ref={this.container}>
        {this.loadPages().map(page => page)}
      </div>
    );
  }
}

interface PDFViewerProps {
  src: string;
}
