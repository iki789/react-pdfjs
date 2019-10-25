import React, { Component, RefObject } from "react";
import "./paper.css";

export default class Paper extends Component {
  canvasRef: RefObject<HTMLCanvasElement> = React.createRef();

  sendCanvas = () => {
    // ()=> this.props.getCanvas()
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
  getCanvas: () => RefObject<HTMLCanvasElement>;
}
