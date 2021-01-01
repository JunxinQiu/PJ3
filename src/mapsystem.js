import React from 'react';
import ReactDom from 'react-dom';
import 'echarts/index';
import ReactQMap from 'react-qmap';
import { qmap } from './mapInstance';




class MapSystem extends React.Component {

    componentDidMount() {
    }

    getMap = (map, wMap) => {
        qmap.instance = wMap;
        qmap.map = map;
        const qMap = wMap;
        const drawingManager = new qMap.drawing.DrawingManager({
            drawingMode: qMap.drawing.OverlayType.MARKER,
            drawingControl: true,
            drawingControlOptions: {
                position: qMap.ControlPosition.TOP_CENTER,
                drawingModes: [
                    qMap.drawing.OverlayType.MARKER,
                    qMap.drawing.OverlayType.CIRCLE,
                    qMap.drawing.OverlayType.POLYGON,
                    qMap.drawing.OverlayType.POLYLINE,
                    qMap.drawing.OverlayType.RECTANGLE,
                ],
            },
            circleOptions: {
                fillColor: new qMap.Color(255, 208, 70, 0.3),
                strokeColor: new qMap.Color(88, 88, 88, 1),
                strokeWeight: 3,
                clickable: false,
            },
        });
        drawingManager.setMap(qmap.map);
        qmap.drawingManager = drawingManager;
        const multiPolyline = new TMap.MultiMarker();
        console.log(multiPolyline)
    }
    render() {
        return <ReactQMap
        center={{latitude: 31.14, longitude: 121.36}}
        initialOptions={{zoomControl: true, mapTypeControl: true}}
        apiKey="BWZBZ-6ESWD-6YW44-PYJMO-PDITF-BOBTA"
        style={{height: 800, width: 800}}    // 高度和宽度默认占父元素的100%
        getMap={this.getMap}
        libraries={["drawing"]}
        >
        
        </ReactQMap>;
    }
}

ReactDom.render(<MapSystem />, document.querySelector('#root'));