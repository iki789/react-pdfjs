import React, { Component, RefObject } from "react";
import "./pdf-viewer.css";
import Paper from "./paper/paper";
import mark from "mark.js";
import SearchUI from "./ui/navigation/search";
const pdfjs = require("pdfjs-dist");
const pdfjsWorker = require("pdfjs-dist/build/pdf.worker.entry");

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default class PDFViewer extends Component<
  PDFViewerProps,
  PDFViewerState
> {
  canvasRef: RefObject<HTMLCanvasElement> = React.createRef();
  src: string = this.props.src;
  pages: number = 1;
  container: RefObject<HTMLDivElement> = React.createRef();
  keywords: string = this.props.keywords;
  PDFdocumentRef: any;
  fullyRenderedPages: number = 0;
  matchedNodes: HTMLCollection | [] = [];
  state = {
    scale: 1,
    pages: 0,
    highlightedIndex: 0
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
            this.markKeywords(this.keywords);
            this.getMatchedNodes();
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

  getMatchedNodes = () => {
    if (this.container.current) {
      this.matchedNodes = this.container.current.getElementsByTagName("mark");
      this.setState({ highlightedIndex: 0 });
      this.scrollToMatchedIndex(this.state.highlightedIndex);
    }
  };

  scrollToMatchedIndex = (matchedNodesIndex: number) => {
    if (this.matchedNodes) {
      const node = this.matchedNodes[matchedNodesIndex];
      const offsetTop = 50;
      const position = node.getBoundingClientRect().top - offsetTop;
      node.classList.add("highlight");
      window.scrollTo({ top: position, left: 0 });
    }
  };

  render() {
    return (
      <div className="pdf-bg pdf-viewer" ref={this.container}>
        {this.loadPages().map(page => page)}
        <SearchUI
          found={23}
          onNext={e => console.log(e)}
          onPrev={e => console.log(e)}
        ></SearchUI>
      </div>
    );
  }
}

interface PDFViewerProps {
  src: string;
  keywords: string;
}

interface PDFViewerState {
  pages: number;
  scale: number;
  highlightedIndex: number;
}
