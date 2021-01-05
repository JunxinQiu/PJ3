import React from 'react';
import ReactDom from 'react-dom';
import 'echarts/index';
import { qmap } from './mapInstance';
import {
    busData,
    busLineGeometries, calculateDistance,
    junctionLabelGeometries,
    junctionMarkerGeometries,
    junctionRoutes,
    junctionWalkable,
    junctions
} from './busData';
import { ControlPanel } from './ui';
import { eventBus, PopConfirm } from './popconfirm';

let styles;
let polylineLayer;
class MapSystem extends React.Component {


    componentDidMount() {
        const map = new TMap.Map("echarts", {
            zoom:14, // 设置地图缩放级别
            center: new TMap.LatLng(31.15, 121.35) // 设置地图中心点坐标
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
					'width': 3, //折线宽度
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
			geometries: junctionRoutes
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
                "junction": new TMap.MarkerStyle({
                    "width": 20,
                    "height": 20,
                    "src": 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerNew.png',
                }),
            },
            geometries: junctionMarkerGeometries
        });

        const labelLayer = new TMap.MultiLabel({
            id: 'label-layer',
            map: map, //设置折线图层显示到哪个地图实例中
            //文字标记样式
            styles: {
                'label': new TMap.LabelStyle({
                    'color': '#000000', //颜色属性
                    'size': 15, //文字大小属性
                    'offset': { x: 0, y: 15 }, //文字偏移属性单位为像素
                    'angle': 0, //文字旋转属性
                    'alignment': 'center', //文字水平对齐属性
                    'verticalAlignment': 'middle', //文字垂直对齐属性
                    'backgroundColor': "red",
                    'border': 'solid blue',

                })
            },
            //文字标记数据
            geometries: junctionLabelGeometries
        });
        qmap.polylineLayer = polylineLayer;
        qmap.markerLayer = markerLayer;
        qmap.labelLayer = labelLayer;
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
        qmap.markerLayer.on('click', this.handleClick);
    }

    halt = () => {
        console.log(qmap);
        qmap.polylineLayer.setGeometries(junctionRoutes);
        qmap.markerLayer.setGeometries(junctionMarkerGeometries);
        this.markerCounter = 0;
        this.startPoint = undefined;
        this.endPoint = undefined;
        qmap.markerLayer.off('click', this.handleClick)
    }
    markerCounter = 0;
    startPoint;
    endPoint;
    handleClick = (event) => {
        console.log(event);
        if (!this.markerCounter) {
            this.startPoint = event.geometry.id; //记录startpoint为junction的下标值，起点
            qmap.markerLayer.add({
                position: event.geometry.position,
                styleId: "start",
            })
            this.markerCounter ++;
        } else if (this.markerCounter === 1) {
            this.endPoint = event.geometry.id;////记录endpoint为junction的下标值
            qmap.markerLayer.add({
                position: event.geometry.position,
                styleId: "end",
            })
            this.markerCounter++;
            this.startCalculating();
        }
    }

    startCalculating = () => {
        let startPoint = Number(this.startPoint);
        let endPoint = Number(this.endPoint);
        // 计算
        //初始化容器，存放列表，列表内容为起始点到其他所有点的最短路径（也为列表，记录junction下标）以及最短路径值。
        //循环（当还存在有junction未被遍历时，同时列表没有更新时），对当前的路径的终点，如果其邻接点路径值为∞，则计算与该点距离并保存进容器
        //如果已经存在路径，计算与该点距离并将其与容器内的最短路径进行比较，若小，更新。
        let distanceTable = junctions.map( (point,index) =>{
            return{
                id:index, //第index个junction
                distance:Infinity, //距离，初始化
                routes:[]//放index的空列表 
            }
        });
        distanceTable[startPoint].distance=0;
        let updateFlag = true;
        while(updateFlag){
           updateFlag=false;
            for(let i = 0; i < distanceTable.length; i++){
            let currentPoint = distanceTable[i];
            if (currentPoint.distance == Infinity ){
                continue;
            }else if(currentPoint.distance != Infinity){
                for (let j = 0; j< junctionWalkable[i].length; j++){
                    let nearbyIndex = junctionWalkable[i][j];
                        let walkableDistance = calculateDistance(i,nearbyIndex)+currentPoint.distance;
                        if (walkableDistance < distanceTable[nearbyIndex].distance){
                            distanceTable[nearbyIndex].distance= walkableDistance;
                            distanceTable[nearbyIndex].routes= currentPoint.routes.concat(i);
                            updateFlag=true;
                        }
                    }
                }
        }
       }
        let result = distanceTable[endPoint].routes.concat(endPoint);
        return this.generateResult(result);
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
            geometries.push(
                {
                styleId: 'style_red',
                paths:result.map( point => {
                    return new TMap.LatLng(junctions[point][0],junctions[point][1])
                })
            })
        }
        qmap.polylineLayer.setGeometries([].concat(...geometries));
        eventBus.onMessage('您的路线是'+'用时XX秒')
    }


    render() {
        return <>
            <ControlPanel start={this.start} halt={this.halt} measure={this.measure}/>
        </>;
    }
}

ReactDom.render(<MapSystem />, document.querySelector('#root'));
ReactDom.render(<PopConfirm />, document.querySelector('#popconfirm'))