import React from 'react';
import ReactDom from 'react-dom';
import 'echarts/index';
import { qmap } from './mapInstance';
import {busData, busLineGeometries}from './busData';


let styles;
let polylineLayer;
class MapSystem extends React.Component {


    componentDidMount() {
        const map = new TMap.Map("echarts", {
            zoom:12, // 设置地图缩放级别
            center: new TMap.LatLng(31.14, 121.36) // 设置地图中心点坐标
        });
        
        // 创建测量工具
        const measureTool = new TMap.tools.MeasureTool({
            map: map
        });
        qmap.instance = map;
        qmap.measureTool = measureTool;
        polylineLayer = new TMap.MultiPolyline({
			id: 'polyline-layer', //图层唯一标识
			map: map,//绘制到目标地图
			//折线样式定义
			styles: {
				'style_blue': new TMap.PolylineStyle({
					'color': 'rgba(55,119,255,0.9)', //线填充色
					'width': 2, //折线宽度
					'lineCap': 'butt' //线端头方式
				}),
				'style_red': new TMap.PolylineStyle({
					'color': '#CC0000', //线填充色
					'width': 6, //折线宽度
					'lineCap': 'round' //线端头方式
                }),
                'style_busLine': new TMap.PolylineStyle({
					'color': 'rgba(55,119,255,1)', //线填充色
					'width': 6, //折线宽度
					'lineCap': 'butt' //线端头方式
                }),
                
			},
			//折线数据定义
			geometries: busLineGeometries
        });
        console.log(polylineLayer)

        const markerLayer = new TMap.MultiMarker({
            id: 'marker-layer',
            map: map,
            styles: {
                "start": new TMap.MarkerStyle({
                    "width": 25,
                    "height": 35,
                    "anchor": { x: 16, y: 32 },
                    "src": 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png'
                }),
                "end": new TMap.MarkerStyle({
                    "width": 35,
                    "height": 35,
                    "src": 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerNew.png',
                }),
            },
            geometries: [
            //     {
            //     "id": 'demo',
            //     "styleId": 'marker',
            //     "position": new TMap.LatLng(39.984104, 116.307503),
            //     "properties": {
            //         "title": "marker"
            //     }
            // }
        ]
        });
        qmap.polylineLayer = polylineLayer;
        qmap.markerLayer = markerLayer;
    }

    measure = () => {
        qmap.measureTool.measureDistance().then(res => {
            const info = res.path.map(({lat, lng}) => {
                return [lat, lng];
            } );
            console.log(info, JSON.stringify(info));
        })
    }

    start = () => {
        qmap.instance.on('click', this.handleClick);
    }

    halt = () => {
        console.log(qmap);
        qmap.polylineLayer.setGeometries([]);
        qmap.markerLayer.setGeometries([]);
        this.markerCounter = 0;
        this.startPoint = undefined;
        this.endPoint = undefined;
        qmap.instance.off('click', this.handleClick)
    }
    markerCounter = 0;
    startPoint;
    endPoint;
    handleClick = (event) => {
        console.log(event);
        if (!this.markerCounter) {
            this.startPoint = event.latLng;
            qmap.markerLayer.add({
                position: event.latLng,
                styleId: "start",
            })
            this.markerCounter ++;
        } else if (this.markerCounter === 1) {
            this.endPoint = event.latLng;
            qmap.markerLayer.add({
                position: event.latLng,
                styleId: "end",
            })
            this.markerCounter++;
            this.startCalculating();
        }
    }

    startCalculating = () => {
        let { startPoint, endPoint } = this;
        // 计算
        return this.generateResult();
    }

    // result的输入格式为：[{
    // name: number,
    // startIndex: number,
    // endIndex: number
    // }]
    generateResult = (result = []) => {
        const geometries = [];
        if (result.length === 0) {
            geometries.push({
                styleId: 'style_red',
                paths: [new TMap.LatLng(this.startPoint.lat, this.startPoint.lng), new TMap.LatLng(this.endPoint.lat, this.endPoint.lng)]
            })
        } else {
            const busStartPoint = busData.find(one => one.name === result[0].name).stations[result[0].startIndex];
            const busEndPoint = busData.find(one => one.name === result[result.length -1].name).stations[result[result.length-1].endIndex];
            geometries.push({
                styleId: 'style_red',
                paths: [new TMap.LatLng(this.startPoint.lat, this.startPoint.lng), new TMap.LatLng(busStartPoint.lat, busStartPoint.lng)]
            }, {
                styleId: 'style_red',
                paths: [new TMap.LatLng(this.endPoint.lat, this.endPoint.lng), new TMap.LatLng(busEndPoint.lat, busEndPoint.lng)]
            })
            geometries.push(result.map(one => {
                const busLine = busData.find(data => data.name === one.name);
                const paths = busLine.stations.slice(one.startIndex, one.endIndex).map(({lat, lng}) => (new TMap.LatLng(lat, lng)));
                return {
                styleId: 'style_busLine',
                paths
            };}))
        }
        qmap.polylineLayer.setGeometries(busLineGeometries.concat(...geometries));
    }


    render() {
        return <><button onClick={this.start}>开始画图</button>
            <button onClick={this.halt}>重置</button>
        </>;
    }
}

ReactDom.render(<MapSystem />, document.querySelector('#root'));