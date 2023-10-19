import React, { Component, createRef, RefObject } from "react";
import Draggable from "react-draggable";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import DraggableCard from "./DraggableCard";
import { DocRenderer } from "@cyntler/react-doc-viewer";

type State = {
  fileType: "pdf" | "xlsx" | "docx" | "image"|"ppt";
  viewerHeight: string;
  shapes: Array<"square" | "circle" | "triangle">;
  selectedShapeIndex: number | null;
};
type DocViewerProps = {
  documents: Array<{ uri: string }>;
  pluginRenderers: DocRenderer[];
  config: {
    header: {
      disableHeader: boolean;
      disableFileName: boolean;
      retainURLParams: boolean;
    };
  };
  style: { height: string };
};

class ControlledDocViewer extends Component<DocViewerProps, any> {
  shouldComponentUpdate(nextProps: DocViewerProps) {
    // Chỉ tái render khi URI thay đổi
    return nextProps.documents[0].uri !== this.props.documents[0].uri;
  }

  render() {
    return <DocViewer {...this.props} />;
  }
}

class DocumentViewer extends Component<{}, State> {
  private docViewerRef: RefObject<HTMLDivElement>;

  constructor(props: {}) {
    super(props);
    this.state = {
      fileType: "pdf",
      viewerHeight: "100%",
      shapes: [],
      selectedShapeIndex: null,
    };
    this.docViewerRef = createRef();
  }

  toggleFileType = () => {
    const fileTypes = ["pdf", "xlsx", "docx", "ppt"];
    const currentIndex = fileTypes.indexOf(this.state.fileType);
    const nextIndex = (currentIndex + 1) % fileTypes.length;
    this.setState({
      fileType: fileTypes[nextIndex] as "pdf" | "xlsx" | "docx" | "image" | "ppt",

      shapes: [], // Reset shapes
    });
  };

  getDocuments = () => {
    switch (this.state.fileType) {
      case "pdf":
        return [{ uri: process.env.PUBLIC_URL + "/c4611_sample_explain.pdf" }];
      case "xlsx":
        return [
          {
            uri: "https://transfer.sh/c1onBs00w2/%E5%8F%82%E6%95%B0%E8%A1%A8.xlsx",
          },
        ];
      case "docx":
        return [{ uri: "https://transfer.sh/rvq45hMe0N/sample1.docx" }];
      case "ppt":
        return [{ uri: "https://transfer.sh/9hXYSLu39h/file_example_PPT_1MB.ppt" }];
      default:
        return [];
    }
  };

  updateViewerHeight = () => {
    if (this.docViewerRef.current) {
      const documentHeight = this.docViewerRef.current.scrollHeight;
      switch (this.state.fileType) {
        case "pdf":
          this.setState({
            viewerHeight: `${documentHeight}px`,
          });
          break;
        case "xlsx":
  
          this.setState({
            viewerHeight:`300vh`,
          });
          break;
        case "docx":
    
          this.setState({
            viewerHeight:"100vh",
          });
          break;
        case "ppt":
   
          this.setState({
            viewerHeight:"100vh",
          });
          break;
        default:
          break;
      }
    }
  };
  

  componentDidMount() {
    this.updateViewerHeight();
    window.addEventListener("resize", this.updateViewerHeight);
  }



  addShape = (shape: "square" | "circle" | "triangle") => {
    this.setState((prevState) => ({
      shapes: [...prevState.shapes, shape],
    }));
  };

  removeShape = (indexToRemove: number) => {
    this.setState((prevState) => ({
      shapes: prevState.shapes.filter((_, index) => index !== indexToRemove),
      selectedShapeIndex: null,
    }));
  };

  selectShape = (index: number) => {
    this.setState({ selectedShapeIndex: index });
  };

  render() {
    return (
      <>
        <div
          className={`pdf-viewer-with-draggable ${
            this.state.fileType === "xlsx" ? "xlsx" : ""
          }`}
        >
          <div className="right-panel">
            {this.state.fileType === "pdf" ? (
              <ControlledDocViewer
                ref={this.docViewerRef as any}
                pluginRenderers={DocViewerRenderers}
                documents={this.getDocuments()}
                config={{
                  header: {
                    disableHeader: false,
                    disableFileName: false,
                    retainURLParams: false,
                  },
                }}
                style={{ height: this.state.viewerHeight }}
              />
            ) : this.state.fileType === "xlsx" ? (
              <iframe
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(
                  "https://transfer.sh/c1onBs00w2/%E5%8F%82%E6%95%B0%E8%A1%A8.xlsx"
                )}&embedded=true`}
                width="100%"
                height="100%"
                frameBorder="0"
              />
            ) : this.state.fileType === "docx" ? (
              <iframe
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(
                  "https://transfer.sh/rvq45hMe0N/sample1.docx"
                )}&embedded=true`}
                width="100%"
                height="100%"
                frameBorder="0"
              />
            ) : this.state.fileType === "ppt" ? (
              <iframe
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(
                "https://transfer.sh/9hXYSLu39h/file_example_PPT_1MB.ppt"
              )}&embedded=true`}
              width="100%"
              height="100%"
              frameBorder="0"
            />
            ) : null}
          </div>
          <div className="left-panel">
            <div className="shapes-container">
              {this.state.shapes.map((shape, index) => (
                <DraggableCard
                  key={index}
                  shape={shape}
                  onRemove={() => this.removeShape(index)}
                />
              ))}
            </div>
            <div className="button-shape-container">
              <button onClick={() => this.addShape("square")}>square</button>
              <button onClick={() => this.addShape("circle")}>circle</button>
              <button onClick={() => this.addShape("triangle")}>
                triangle
              </button>
            </div>
            <div className="button-shape-container-content">
              <div className="button-shape-container-content-text">
                <textarea placeholder="Nhập thông tin ở đây"></textarea>
              </div>
              <div className="button-shape-container-content-state">
                アサイン
                <select>
                  <option value="option1">HOANG VAN HIEU</option>
                  <option value="option2">NGUYEN VAN DUNG</option>
                  <option value="option3">HUYNH TUAN THANH</option>
                  <option value="option1">NGUYEN VAN VAN</option>
                  <option value="option2">VO NHAT QUANG</option>
                </select>
                ステータス
                <select>
                  <option value="option1">未着手</option>
                  <option value="option2">進行中</option>
                  <option value="option3">完了</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <footer>
          <button className="button-link" onClick={this.toggleFileType}>
            Chuyển đổi
          </button>
        </footer>
      </>
    );
  }
}

export default DocumentViewer;
