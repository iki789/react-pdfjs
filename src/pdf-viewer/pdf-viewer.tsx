import React, { Component, RefObject } from "react";
import "./pdf-viewer.css";
import Paper from "./paper/paper";
const pdfjs = require("pdfjs-dist");
const pdfjsWorker = require("pdfjs-dist/build/pdf.worker.entry");

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default class PDFViewer extends Component<PDFViewerProps> {
  canvasRef: RefObject<HTMLCanvasElement> = React.createRef();
  src: string = this.props.src;
  scale: number = 1.7;
  state = {
    page: 1,
    paperWidth: 0,
    paperHeight: 0
  };
  PDFdocumentRef: any;

  fetchPdf = async () => {
    if (!this.PDFdocumentRef) {
      this.PDFdocumentRef = pdfjs.getDocument(this.src);
    }
    return this.PDFdocumentRef;
  };

  render() {
    return (
      <div className="pdf-bg">
        <Paper
          documentLoadRef={this.fetchPdf()}
          page={1}
          scale={this.scale}
        ></Paper>
        <div>
          <button
            onClick={() =>
              this.setState({
                page: this.state.page < 2 ? 1 : this.state.page - 1
              })
            }
          >
            Prev
          </button>
          <button onClick={() => this.setState({ page: this.state.page + 1 })}>
            NEXT
          </button>
        </div>
      </div>
    );
  }
}

interface PDFViewerProps {
  src: string;
}
