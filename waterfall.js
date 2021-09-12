/*
 *** ECHARTS - CUSTOM WATERFALL *** 
 - https://echarts.apache.org/examples/en/editor.html?c=custom-profit
 - https://echarts.apache.org/en/option.html#series-custom.renderItem
 - https://github.com/apache/echarts/issues/11885
 */

let waterfallId = document.getElementById('waterfall-1');
const waterfallChart = echarts.init(waterfallId, 'tech-blue');

const waterfallData =  [
    ['barLabel', 'barStartValue', 'barEndValue', 'referenceDatapoint'],
    ['Total Assets', 0, 67612],
    ['Total Liabilities', 67612, -16303],
    ['Equity', -16303, 7500, 1],
    ['Interest', 7500, 7500],
    ['Total Debt', 7500, 48980],
    ['Value', 48980, 66657, 1],
];

// const waterfallData = [
//     ['barLabel', 'barStartValue', 'barEndValue'],
//     ['Total', 0, 100],
//     ['Label 1', 20, 100],
//     ['Label 2', -10, 20],
//     ['Label 3', 30, -10],
//     ['Net', 30, 0],
// ];

const lastBarIndex = waterfallData.length - 2;
let hasReferenceData = false;
const waterfallOption = {
    title: {
        show: true,
        text: 'Waterfall - Custom',
        left: 'center',
        textStyle: {
            color: '#333',
            fontFamily: 'Verdana, sans-serif',
            fontWeight: 600,
            fontSize: 16,
        },
    },
    tooltip: {
        show: false,
        trigger: 'item',
    },
    dataset: {
        source: waterfallData,
    },
    xAxis: {
        show: true,
        type: 'category',
    },
    yAxis: {
        show: true,
        type: 'value',
    },
    series: [
        {
            type: 'custom',
            label: {
                show: true,
                position: 'top',
                color: '#97999b',
                fontWeight: 'bold',
                fontSize: 10,
                formatter: params => {
                    const labelData = params.data[2] - params.data[1];
                    return labelData;
                },
            },
            datasetIndex: 0,
            encode: {
                // x: 'barLabel',
                y: 2,
                // tooltip: [0, 1, 2],
                // label: [1],
            },
            // dimensions: ['label', 'draw from', 'draw to', 'net value'],
            // https://echarts.apache.org/en/option.html#series-custom.renderItem
            renderItem: (params, api) => {
                const dataIndex = api.value(0);
                const barStartValue = api.value(1);
                const barEndValue = api.value(2);
                const startCoord = api.coord([dataIndex, barStartValue]);
                const endCoord = api.coord([dataIndex, barEndValue]);

                const rectWidth = 50;
                const rectMinHeight = 1;
                let rectHeight = startCoord[1] - endCoord[1];

                const style = api.style();
                style.fill = chartThemeColor[dataIndex];
                if (rectHeight < 0) {
                    style.fill = '#FE433C'; // red (negativeColor)
                } else if (rectHeight === 0) {
                    style.fill = '#ededed'; // ltgray (neutralValueColor)
                } else {
                    style.fill = '#0095EF'; // blue (positiveColor)
                }

                const referenceData = api.value(3);
                if (referenceData === 1) {
                    style.fill = '#228B22'; // green (referenceColor)
                    hasReferenceData = true;
                } else if (referenceData === 0) {
                    style.fill = '#808080'; // gray (nonReferenceColor)
                }

                // if referenceDatapoint undefined, set last bar to green reference color
                if (hasReferenceData === false && dataIndex === lastBarIndex) {
                    style.fill = '#228B22'; // green (referenceColor)
                }

                rectHeight = rectHeight === 0 ? rectMinHeight : rectHeight;
                const rectItem = {
                    type: 'rect',
                    shape: {
                        x: endCoord[0] - rectWidth / 2,
                        y: endCoord[1],
                        width: rectWidth,
                        height: rectHeight,
                    },
                    style: style,
                };
                return rectItem;
            },
        },
    ]
};

const chartThemeColor = [
    '#0076A8',
    '#00A3E0',
    '#1FBCFF',
    '#5ACEFF',
    '#78D6FF',
    '#A0DCFF',
    '#C3EDFF'
];

waterfallChart.setOption(waterfallOption);
