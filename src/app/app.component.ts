import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';

declare var Quagga: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private lastResult = "No Changes";

  ngOnChanges(changes: SimpleChanges) {
    if (changes['lastResult']) {
      console.log(this.lastResult);
    }
  }

  ngOnInit() {
    console.log(this);
    let state = {
      inputStream: {
        type : "LiveStream",
        constraints: {
          width: {min: 640},
          height: {min: 480},
          facingMode: "environment",
          aspectRatio: {min: 1, max: 2}
        }
      },
      locator: {
        patchSize: "medium",
        halfSample: true
      },
      numOfWorkers: 4,
      decoder: {
        readers : [{
          format: "code_128_reader",
          config: {}
        }]
      },
      locate: true
    };

    Quagga.init(state, (err) => {
      if (err) {
        return console.log(err);
      }

      Quagga.start();
    });

    Quagga.onProcessed(this.onProcessed);

    Quagga.onDetected(this.logCode);

  }

  onProcessed(result: any) {
    var drawingCtx = Quagga.canvas.ctx.overlay,
    drawingCanvas = Quagga.canvas.dom.overlay;

    if (result) {
      if (result.boxes) {
        drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
        result.boxes.filter(function (box) {
          return box !== result.box;
        }).forEach(function (box) {
          Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
        });
      }

      if (result.box) {
        Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
      }

      if (result.codeResult && result.codeResult.code) {
        Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
      }
    }
  }

  logCode(result) {
    this.lastResult = result.codeResult.code;
    console.log(this);
  }
}
