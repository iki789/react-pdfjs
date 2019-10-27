import React from "react";
import "./search.css";

import Button from "../../button";

export default class Search extends React.Component<SearchProps, SearchState> {
  state: SearchState = {
    current: 1,
    found: 0
  };

  componentDidMount() {
    this.setState({ found: this.props.found });
  }

  onNext = () => {
    this.setState({ current: this.state.current + 1 }, () => {
      this.props.onNext(this.state.current);
    });
  };

  onPrev = () => {
    this.setState({ current: this.state.current - 1 }, () => {
      this.props.onNext(this.state.current);
    });
  };

  render() {
    const searchControls = (
      <div className="search-container">
        <div className="search-count">
          {" "}
          {this.state.current} / {this.props.found}
        </div>
        <div className="action-buttons">
          <Button
            icon={true}
            disabled={this.state.current >= this.state.found ? true : false}
            onClick={this.onNext}
          >
            <img
              src={require("../../icons/keyboard_arrow_down-24px.svg")}
              alt="next"
            />
          </Button>
          <Button
            icon={true}
            disabled={this.state.current < 2 ? true : false}
            style={{ transform: "scale(1,-1)" }}
            onClick={this.onPrev}
          >
            <img
              src={require("../../icons/keyboard_arrow_down-24px.svg")}
              alt="previous"
            />
          </Button>
        </div>
      </div>
    );
    return (
      <React.Fragment>{this.state.found ? searchControls : ""}</React.Fragment>
    );
  }
}

interface SearchProps {
  found: number;
  onNext: (current: number) => any;
  onPrev: (current: number) => any;
}

interface SearchState {
  found: number;
  current: number;
}
