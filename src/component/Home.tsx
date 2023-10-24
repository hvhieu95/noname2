import React, { useState, useEffect } from "react";
import { Link, useRoutes } from "react-router-dom";
import documents from "../documents";
import { DocumentType } from "../documents";
import DocumentViewer from "./DocumentViewer";

const Home: React.FC = () => {
  const [documentsState, setDocumentsState] = useState(() => {
    const savedDocuments = localStorage.getItem("documents");
    return savedDocuments ? JSON.parse(savedDocuments) : documents;
  });

  useEffect(() => {
    const savedDocuments = localStorage.getItem("documents");
    if (savedDocuments) {
      setDocumentsState(JSON.parse(savedDocuments));
    }
  }, []);

  const routes = useRoutes([
    {
      path: "/",
      element: (
        <div className="home-container home-page">
          <h1 className="mb-4">Home</h1>
          <div className="list-file-content">
          <table className="table table-hover table-bordered table-striped">
          <thead>
                <tr>
                  <th scope="col">名ファイル</th>
                  <th scope="col">アサイン</th>
                  <th scope="col">ステータス</th>
                </tr>
              </thead>
              <tbody>
                {documentsState.map((doc: DocumentType) => (
                  <tr key={doc.id} className="list-file">
                    <td>
                      <Link
                        to={`/document/${doc.id}`}
                        className="text-decoration-none"
                      >
                        {doc.name}
                      </Link>
                    </td>
                    <td> {doc.assign || " 未指定"}</td>
                    <td>{doc.status || "未確認"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      path: "/document/:id",
      element: <DocumentViewer updateDocumentsState={setDocumentsState} />,
    },
  ]);

  return routes;
};

export default Home;
