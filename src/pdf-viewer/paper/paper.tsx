import React, { Component, RefObject } from "react";
import { PDFRenderParams, TextContent, PDFRenderTask } from "pdfjs-dist";
import "./paper.css";
const pdfjs = require("pdfjs-dist");

export default class Paper extends Component<PaperProps, PaperState> {
  canvasRef: RefObject<HTMLCanvasElement> = React.createRef();

  state: PaperState = {
    canvasWidth: 0,
    canvasHeight: 0,
    scale: 1
  };

  componentDidMount() {
    this.setState({ scale: this.props.scale });
    // this.renderPage();
    // console.log(this.props.documentLoadRef);
  }

  componentDidUpdate(prevProps: PaperProps) {
    if (this.props.documentLoadRef) {
      this.renderPage();
    }
  }

  renderPage = async () => {
    const loadingTask = this.props.documentLoadRef;

    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(this.props.page);
    const viewport = page.getViewport({ scale: this.state.scale });

    // Prepare canvas using PDF page dimensions
    const canvas = this.canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      if (this.state.canvasWidth < 1 || this.state.canvasWidth < 1) {
        this.setState({ canvasHeight: canvas.height });
        this.setState({ canvasWidth: canvas.width });
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
        // if (textLayer) {
        //   textLayer.innerHTML = "";
        //   const markI = new mark(textLayer);
        //   markI.mark("Logitech", {
        //     acrossElements: true
        //   });
        // }
        pdfjs.renderTextLayer({
          textContent: textContent,
          container: document.querySelector("#text-layer"),
          viewport: viewport,
          textDivs: []
        });
      }
    }
  };

  render() {
    return (
      <div>
        <div className="pdf-viewer-paper-container">
          <canvas ref={this.canvasRef}></canvas>
        </div>
      </div>
    );
  }
}

interface PaperProps {
  page: number;
  documentLoadRef: any;
  scale: number;
}

interface PaperState {
  canvasWidth: number;
  canvasHeight: number;
  scale: number;
}
