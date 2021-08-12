import pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import pdfjsViewer from 'pdfjs-dist/web/pdf_viewer';
import 'pdfjs-dist/web/pdf_viewer.css';
import './index.css';

// pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.2.2/pdf.worker.min.js';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const main = async () => {
  const url = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf';
  // const url = '/sample.pdf';
  const container = document.querySelector('#pdf-wrapper');
  const pageNumber = 1;
  const scale = 1;
  const loadingTask = pdfjsLib.getDocument(url);
  loadingTask.promise.then(pdfDocument => {
    const eventBus = new pdfjsViewer.EventBus();
    return pdfDocument.getPage(pageNumber).then(pdfPage => {
      const pdfPageView = new pdfjsViewer.PDFPageView({
        container: container,
        id: pageNumber,
        scale,
        eventBus,
        defaultViewport: pdfPage.getViewport({ scale }),

        // NOTE: this will create a DIV DOM for text selection
        // Enable text/annotations layers, if needed
        textLayerFactory: new pdfjsViewer.DefaultTextLayerFactory(),
        annotationLayerFactory: new pdfjsViewer.DefaultAnnotationLayerFactory(),
      });
      // Associates the actual page with the view, and drawing it
      pdfPageView.setPdfPage(pdfPage);
      return pdfPageView.draw();
    }).catch(function (reason) {
      console.error("Error: " + reason);
    });
  });
}

main();
