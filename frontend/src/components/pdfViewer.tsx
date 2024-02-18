import React, { useEffect } from "react";
import ReactDOM from "react-dom";
// import { PDFViewer } from '@react-pdf/renderer';
// import { Document, Page } from "react-pdf";

import axios from "axios";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   "pdfjs-dist/build/pdf.worker.min.js",
//   import.meta.url
// ).toString();

const PDFViewer = ({
  documentLoader,
  documentURL,
}: {
  documentLoader?: any;
  documentURL: string;
}) => {
  const [state, setState] = React.useState({
    numPages: null,
    pageNumber: 1,
    state: "loading",
    document: null as any,
  });

  useEffect(() => {
    loadDocument();
  }, [documentURL]);

  const loadDocument = async () => {
    if (documentLoader) {
      const doc = await documentLoader();
      setState((prev) => ({
        ...prev,
        document: doc,
      }));
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: any) => {
    setState((prev) => ({
      ...prev,
      numPages: numPages,
      state: "loaded",
    }));
  };
  return (
    <div style={{
      // width: "100%",
      // height: "100%",
      // overflow: "auto",
      display: "flex",
      justifyContent: "center",
      // alignItems: "center",
      // backgroundColor: "white",
    
    }}>
      <Document
        file={documentURL ? documentURL : state.document}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(error: any) => console.error(error)}
      >
        {Array.from(new Array(state.numPages), (el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            width={500}              
          />
        ))}
        {/* <Page pageNumber={state.pageNumber} /> */}
      </Document>
    </div>
  );
};

export default PDFViewer;
