import React from 'react';
import ReactDom from 'react-dom';
import 'echarts/index';
import { qmap } from './mapInstance';
import {busData}from './busData';


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
        styles= {
            'style_blue': new TMap.PolylineStyle({
                'color': '#3777FF', //线填充色
                'width': 6, //折线宽度
                'borderWidth': 5, //边线宽度
                'borderColor': '#FFF', //边线颜色
                'lineCap': 'butt' //线端头方式
            }),
            'style_red': new TMap.PolylineStyle({
                'color': '#CC0000', //线填充色
                'width': 6, //折线宽度
                'borderWidth': 5, //边线宽度
                'borderColor': '#CCC', //边线颜色
                'lineCap': 'round' //线端头方式
            })
        };
        polylineLayer = new TMap.MultiPolyline({
			id: 'polyline-layer', //图层唯一标识
			map: map,//绘制到目标地图
			//折线样式定义
			styles: {
				'style_blue': new TMap.PolylineStyle({
					'color': '#3777FF', //线填充色
					'width': 6, //折线宽度
					'borderWidth': 5, //边线宽度
					'borderColor': '#FFF', //边线颜色
					'lineCap': 'butt' //线端头方式
				}),
				'style_red': new TMap.PolylineStyle({
					'color': '#CC0000', //线填充色
					'width': 6, //折线宽度
					'borderWidth': 5, //边线宽度
					'borderColor': '#CCC', //边线颜色
					'lineCap': 'round' //线端头方式
				})
			},
			//折线数据定义
			geometries: [
				{//第1条线
					'id': 'pl_1',//折线唯一标识，删除时使用
					'styleId': 'style_blue',//绑定样式名
					'paths': [new TMap.LatLng(40.038540, 116.272389), new TMap.LatLng(40.038844, 116.275210), new TMap.LatLng(40.041407, 116.274738)]
				},
				{//第2条线
					'id': 'pl_2',	
					'styleId': 'style_red',
					'paths': [new TMap.LatLng(40.039492,116.271893), new TMap.LatLng(40.041562,116.271421), new TMap.LatLng(40.041957,116.274211)]
				}
			]
        });
        console.log(polylineLayer)
    }

    measure = () => {
        qmap.measureTool.measureDistance().then(res => {
            const info = res.path.map(({lat, lng}) => {
                return [lat, lng];
            } );
            console.log(info, JSON.stringify(info));
        })
    }

    render() {
        return <button onClick={this.measure}>开始画图</button>;
    }
}

ReactDom.render(<MapSystem />, document.querySelector('#root'));