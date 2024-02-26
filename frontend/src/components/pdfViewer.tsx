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
  const [pages, setPages] = React.useState([] as any);
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
    let doc = await pdfjs.getDocument(documentURL).promise;
    const pagesPromises = [];

    for (let i = 1; i <= doc.numPages; i++) {
      pagesPromises.push(doc.getPage(i));
    }

    const pages = await Promise.all(pagesPromises);

    // const svgPages = await Promise.all(
    //   pages.map(async (page) => {
    //     const viewport = page.getViewport({ scale: 1.5 });
    //     const operatorList = await page.getOperatorList();

    //     const svgGfx = new pdfjs.SVGGraphics(page.commonObjs, page.objs);
    //     svgGfx.embedFonts = true;

    //     const svg = await svgGfx.getSVG(operatorList, viewport);
    //     return svg;
    //   })
    // );


    // console.log("SVG PAGES", svgPages);

    // setPages(svgPages);

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

  console.log("Pages", pages)
  return (
    <div
      style={{
        // width: "100%",
        // height: "100%",
        // overflow: "auto",
        display: "flex",
        justifyContent: "center",
        // alignItems: "center",
        // backgroundColor: "white",
      }}
    >
      {/* <div>
        {pages.map((svg: any, index: any) => (
          <div
            key={index}
            dangerouslySetInnerHTML={{ __html: svg.outerHTML }}
          />
        ))}
      </div> */}
      <Document
        // renderMode="svg"
        file={documentURL ? documentURL : state.document}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(error: any) => console.error(error)}
        
      >
        {Array.from(new Array(state.numPages), (el, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} width={500}   />
        ))}
        {/* <Page pageNumber={state.pageNumber} /> */}
      </Document>
    </div>
  );
};

export default PDFViewer;
