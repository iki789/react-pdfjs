import React, { Component, RefObject } from "react";
import "./pdf-viewer.css";
import { PDFRenderParams, TextContent, PDFRenderTask } from "pdfjs-dist";
import mark from "mark.js";
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

  componentDidMount() {
    this.fetchPdf();
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    if (
      this.state.paperWidth !== prevState.paperWidth ||
      this.state.page !== prevState.page
    ) {
      this.fetchPdf();
    }
  }

  fetchPdf = async () => {
    const loadingTask = pdfjs.getDocument(this.src);

    const pdf = await loadingTask.promise;
    const firstPageNumber = this.state.page;
    const page = await pdf.getPage(firstPageNumber);
    const viewport = page.getViewport({ scale: this.scale });

    // Prepare canvas using PDF page dimensions
    const canvas = this.canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      if (this.state.paperHeight < 1 || this.state.paperWidth < 1) {
        this.setState({ paperHeight: canvas.height });
        this.setState({ paperWidth: canvas.width });
      }

      if (context) {
        // Render PDF page into canvas context
        const renderContext: PDFRenderParams = {
          canvasContext: context,
          viewport: viewport
        };
        const renderTask: PDFRenderTask = page.render(renderContext);
        await renderTask.promise;
        const textContent: TextContent = await page.getTextContent();
        // empty layer text
        const textLayer: HTMLDivElement | null = document.querySelector(
          "#text-layer"
        );
        if (textLayer) {
          textLayer.innerHTML = "";
          const markI = new mark(textLayer);
          markI.mark("Logitech", {
            acrossElements: true
          });
        }
        pdfjs.renderTextLayer({
          textContent: textContent,
          container: document.querySelector("#text-layer"),
          viewport: viewport,
          textDivs: []
        });
        const ne: HTMLBodyElement | null = document.querySelector("body");
        if (ne) {
          const markI = new mark(ne);
          markI.mark("Next", {
            acrossElements: true
          });
        }
      }
    }
  };

  buildText = (textContent: TextContent) => {};

  render() {
    return (
      <div className="pdf-bg">
        <div
          className="pdf-viewer-paper-container"
          style={{
            width: this.state.paperWidth,
            height: this.state.paperWidth,
            margin: "auto"
          }}
        >
          <canvas ref={this.canvasRef}></canvas>
          <div className="textWrapper">
            <div id="text-layer"></div>
          </div>
        </div>
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
