import React, { Component, RefObject } from "react";
import { PDFRenderParams, PDFRenderTask, TextContent } from "pdfjs-dist";
import "./paper.css";
const pdfjs = require("pdfjs-dist");

export default class Paper extends Component<PaperProps, PaperState> {
  canvasRef: RefObject<HTMLCanvasElement> = React.createRef();
  textLayerRef: RefObject<HTMLDivElement> = React.createRef();
  container: RefObject<HTMLDivElement> = React.createRef();
  state: PaperState = {
    canvasWidth: 0,
    canvasHeight: 0,
    scale: 1,
    rendered: false
  };

  componentDidMount() {
    this.setState({ scale: this.props.scale });
    if (this.props.documentLoadRef) {
      this.renderPage();
    }
  }

  renderPage = async () => {
    const loadingTask = this.props.documentLoadRef;
    const pdf = await loadingTask;
    const page = await pdf.getPage(this.props.page);
    let viewport = page.getViewport({ scale: this.props.scale });
    if (this.container.current) {
      this.setState({
        scale:
          (this.container.current.clientWidth / viewport.width) *
          (this.props.scale / 1.8)
      });
      viewport = page.getViewport({
        scale: this.state.scale
      });
    }

    // Prepare canvas using PDF page dimensions
    const canvas = this.canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      this.setState({ canvasHeight: canvas.height, canvasWidth: canvas.width });

      if (context) {
        // Render PDF page into canvas context
        const renderContext: PDFRenderParams = {
          canvasContext: context,
          viewport: viewport
        };
        console.log(canvas.width, canvas.height);
        const renderTask: PDFRenderTask = page.render(renderContext);
        this.setState({ rendered: true });
        await renderTask.promise;
        const textContent: TextContent = await page.getTextContent();
        // empty layer text
        // const textLayer: HTMLDivElement | null = document.querySelector(
        //   "#text-layer"
        // );
        // if (textLayer) {
        //   textLayer.innerHTML = "";
        //   const markI = new mark(textLayer);
        //   markI.mark("Logitech", {
        //     acrossElements: true
        //   });
        // }
        pdfjs.renderTextLayer({
          textContent: textContent,
          container: this.textLayerRef.current,
          viewport: viewport,
          textDivs: []
        });
      }
    }
  };

  render() {
    return (
      <div>
        <div className="pdf-viewer-paper-container" ref={this.container}>
          <div
            style={{
              width: this.state.canvasWidth,
              height: this.state.canvasHeight,
              margin: "auto",
              position: "relative"
            }}
          >
            <canvas className="paper-canvas" ref={this.canvasRef}></canvas>
            <div className="text-layer" ref={this.textLayerRef}></div>
          </div>
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
  rendered: boolean;
}
