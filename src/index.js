import pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import { TextLayerBuilder } from 'pdfjs-dist/lib/web/text_layer_builder';
// import 'pdfjs-dist/lib/web/ui_utils';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const main = async () => {
  const url = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf';
  // const url = '/sample.pdf';
  const loadingTask = pdfjsLib.getDocument(url);
  loadingTask.promise
    .then(function (pdfDocument) {
      // Request a first page
      return pdfDocument.getPage(1).then(function (pdfPage) {
        // Display page on the existing canvas with 100% scale.
        const viewport = pdfPage.getViewport({ scale: 1.0 });
        console.log('viewport:', viewport);
        const canvas = document.getElementById("theCanvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        const renderTask = pdfPage.render({
          canvasContext: ctx,
          viewport,
        });

        var $textLayerDiv = document.getElementById('text-layer');

        pdfPage.getTextContent().then(function(textContent){
          var textLayer = new TextLayerBuilder({
            textLayerDiv : $textLayerDiv,
            pageIndex : 0,
            viewport : viewport
          });

          textLayer.setTextContent(textContent);
          textLayer.render();
        });

        return renderTask.promise;
      });
    })
    .catch(function (reason) {
      console.error("Error: " + reason);
    });
}

main();
