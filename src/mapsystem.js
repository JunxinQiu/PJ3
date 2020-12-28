import React from 'react';
import ReactDom from 'react-dom';
import echarts from 'echarts/lib/echarts';
import 'echarts/index';
import { beijing } from './beijing';




class MapSystem extends React.Component {

    componentDidMount() {
        echarts.registerMap('beijing', beijing);
        const chart = echarts.init(document.querySelector('#echarts'));
        chart.setOption({
            title: {
                text: 'ECharts 入门示例'
            },
            series: [{
                type: 'map',
                map: 'beijing'
            }]
        });
    }
    render() {
        return <div>'see what see? not seen before?'</div>;
    }
}

ReactDom.render(<MapSystem />, document.querySelector('#root'));