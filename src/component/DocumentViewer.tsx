import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useParams } from "react-router-dom";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import DraggableCard from "./DraggableCard";
import { DocRenderer } from "@cyntler/react-doc-viewer";
import documents from "../documents";
import Content from "../component/Content";


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
interface DocumentViewerProps {
  updateDocumentsState?: (updatedDocuments: DocumentType[]) => void;
}


const DocumentViewer: React.FC<DocumentViewerProps> = ({ updateDocumentsState }) => {
  const { id } = useParams<{ id: string }>();
  const [document, setDocument] = useState<DocumentType | null>(null);
  const [viewerHeight, setViewerHeight] = useState<string>("100%");
  const [shapes, setShapes] = useState<ShapeType[]>([]);
  const docViewerRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState<string>("");
  const [assign, setAssign] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    const foundDocument = documents.find((doc) => doc.id === id);
    if (foundDocument) {
      setDocument(foundDocument);
    } else {
      setDocument(null);
    }
  
    const savedData = localStorage.getItem(`documentData_${id}`);
    if (savedData) {
      const { shapes, text, assign, status } = JSON.parse(savedData);
      setShapes(shapes);
      setText(text);
      setAssign(assign);
      setStatus(status);
    }
  }, [id]);
  

  const handleSave = useCallback(() => {
    if (shapes.length > 0 || text || assign || status) {
      const dataToSave = { shapes, text, assign, status };
      localStorage.setItem(`documentData_${id}`, JSON.stringify(dataToSave));
      alert("Dữ liệu đã được lưu!");
  
      const updatedDocuments = documents.map((doc) => 
        doc.id === id ? { ...doc, assign, status } : doc
      );
      localStorage.setItem("documents", JSON.stringify(updatedDocuments));
      if (typeof updateDocumentsState === 'function') {
        updateDocumentsState(updatedDocuments);
      }
    } else {
      alert("Dữ liệu chưa được lưu!");
    }
  }, [id, shapes, text, assign, status, updateDocumentsState]);
  

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
    localStorage.setItem(`shapes_${id}`, JSON.stringify(newShapes));
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

          <Content
            text={text}
            assign={assign}
            status={status}
            onChangeAssign={setAssign}
            onChangeStatus={setStatus}
            onChangeText={setText}
          />
        </div>
      </div>

      <footer>
   
        <button className="button-link" onClick={handleSave}>
          Save
        </button>
      </footer>
    </>
  );
};

export default DocumentViewer;