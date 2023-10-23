import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import DraggableCard from "./DraggableCard";
import { DocRenderer } from "@cyntler/react-doc-viewer";
import documents from "../documents";

type ShapeType = {
  type: "square" | "circle" | "triangle";
  position: { x: number; y: number };
};
type State = {
  fileType: "pdf" | "xlsx" | "docx" | "image" | "ppt";
  viewerHeight: string;
  shapes: Array<"square" | "circle" | "triangle">;
  selectedShapeIndex: number | null;
};
type DocumentType = {
  id: string;
  name: string;
  uri: string;
  fileType: "pdf" | "xlsx" | "docx" | "ppt";
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

const DocumentViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [document, setDocument] = useState<DocumentType | null>(null);
  const [viewerHeight, setViewerHeight] = useState<string>("100%");
  const [shapes, setShapes] = useState<ShapeType[]>([]);
  const docViewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const foundDocument = documents.find((doc) => doc.id === id) as
      | DocumentType
      | undefined;
    if (foundDocument) {
      setDocument(foundDocument);
    } else {
      setDocument(null);
    }

    // tải tài liệu đã lưu từ local storage
    const savedShapes = localStorage.getItem(`shapes_${id}`);
    if (savedShapes) {
      setShapes(JSON.parse(savedShapes));
    }
  }, [id]);
  const handleSave = () => {
    if (shapes.length > 0) {
      localStorage.setItem(`shapes_${id}`, JSON.stringify(shapes));
      alert("Dữ liệu đã được lưu!");
    } else {
      alert("Dữ liệu chưa được lưu!");
    }
  };
  
  useEffect(() => {
    const updateViewerHeight = () => {
      if (docViewerRef.current) {
        const documentHeight = docViewerRef.current.scrollHeight;
        switch (document?.fileType) {
          case "pdf":
            setViewerHeight(`${documentHeight}px`);
            break;
          case "xlsx":
          case "docx":
          case "ppt":
            setViewerHeight("500vh");
            break;
          default:
            break;
        }
      }
    };
    updateViewerHeight();
    window.addEventListener("resize", updateViewerHeight);

    return () => {
      window.removeEventListener("resize", updateViewerHeight);
    };
  }, [document]);

  if (!document) {
    return <div>Không tìm thấy tài liệu</div>;
  }

  const getDocuments = () => {
    return [{ uri: document.uri }];
  };

  const toggleFileType = () => {
    if (document) {
      const fileTypes = ["pdf", "xlsx", "docx", "ppt"];
      const currentIndex = fileTypes.indexOf(document.fileType);
      const nextIndex = (currentIndex + 1) % fileTypes.length;
      const newFileType = fileTypes[nextIndex] as DocumentType["fileType"];
      console.log("Chuyển đổi sang loại file:", newFileType);
      setDocument({ ...document, fileType: newFileType });
      setShapes([]);
    }
  };

  const addShape = (shapeType: "square" | "circle" | "triangle") => {
    const newShape = {
      type: shapeType,
      position: { x: 0, y: 0 },
    };
    setShapes((prevShapes) => [...prevShapes, newShape]);
  };

  const onUpdateShapePosition = (
    index: number,
    position: { x: number; y: number }
  ) => {
    setShapes((prevShapes) => {
      const newShapes = [...prevShapes];
      newShapes[index] = { ...newShapes[index], position };
      return newShapes;
    });
  };

  const removeShape = (indexToRemove: number) => {
    const newShapes = shapes.filter((_, index) => index !== indexToRemove);
    setShapes(newShapes);
  };

  return (
    <>
      <div className={`viewer-with-draggable ${document.fileType}`}>
        <div className="right-panel">
          <iframe
            src={`https://docs.google.com/viewer?url=${encodeURIComponent(
              document.uri
            )}&embedded=true`}
            width="100%"
            height="100%"
            frameBorder="0"
          />
        </div>

        <div className="left-panel">
          <div className="shapes-container">
            {shapes.map((shape, index) => (
              <DraggableCard
                key={index}
                shape={shape.type}
                position={shape.position}
                onRemove={() => removeShape(index)}
                onUpdatePosition={(position: { x: number; y: number }) =>
                  onUpdateShapePosition(index, position)
                }
              />
            ))}
          </div>
          <div className="button-shape-container">
            <button onClick={() => addShape("square")}>square</button>
            <button onClick={() => addShape("circle")}>circle</button>
            <button onClick={() => addShape("triangle")}>triangle</button>
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
        <button className="button-link" onClick={toggleFileType}>
          Chuyển đổi
        </button>
        <button className="button-link" onClick={handleSave}>
          Save
        </button>
      </footer>
    </>
  );
};

export default DocumentViewer;
