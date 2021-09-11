/*
 *** ECHARTS - CUSTOM WATERFALL *** 
 - https://echarts.apache.org/examples/en/editor.html?c=custom-profit
 - https://echarts.apache.org/en/option.html#series-custom.renderItem
 - https://github.com/apache/echarts/issues/11885
 */

let waterfallId = document.getElementById('waterfall-1');
const waterfallChart = echarts.init(waterfallId, 'tech-blue');

const waterfallData = [
    ['barLabel', 'barStartValue', 'barEndValue'],
    ['Total', 0, 100],
    ['Label 1', 20, 100],
    ['Label 2', -10, 20],
    ['Label 3', 30, -10],
    ['Net', 30, 0],
];

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
        // scale: true,
        // axisLabel: {
        //     formatter: (value, index) => {
        //         return this.axisLabelFormatter(value.toString(), 15);
        //     },
        // },
    },
    yAxis: {
        show: true,
        type: 'value',
        // axisLabel: {
        //     formatter: label => this.getFormattedUnit(this.config, label, 'yAxis'),
        // },
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
                    // return this.getFormattedUnit(config, labelData, 'barLabel');
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
                // style.fill = this.chartTheme.color[dataIndex];
                style.fill = chartThemeColor[dataIndex];
                if (rectHeight < 0) {
                    // style.fill = this.chartTheme.negColor;
                    style.fill = '#FE433C'; // red
                } else if (rectHeight === 0) {
                    // style.fill = this.chartTheme.neutralValueColor;
                    style.fill = '#ededed'; // ltgray
                } else {
                    // style.fill = this.chartTheme.posColor;
                    style.fill = '#0095EF'; // blue
                }

                const referenceData = api.value(3);
                if (referenceData === 1) {
                    // style.fill = this.chartTheme.refColor;
                    style.fill = '#228B22'; // green
                    hasReferenceData = true;
                } else if (referenceData === 0) {
                    // style.fill = this.chartTheme.nonRefColor;
                    style.fill = '#808080'; // gray
                }

                // if referenceDatapoint undefined, set last bar to green reference color
                if (hasReferenceData === false && dataIndex === lastBarIndex) {
                    // style.fill = this.chartTheme.refColor;
                    style.fill = '#228B22'; // green
                }

                // set rectMinHeight AFTER style so 0 stays as black neutralValueColor
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

// const waterfallOption = {
//     title: {
//         show: false,
//         text: 'Circle of Fifths',
//         left: 'center',
//         textStyle: {
//             color: '#333',
//             fontFamily: '"Roboto Condensed", Verdana, sans-serif',
//             fontWeight: 600,
//             fontSize: 16,
//         },
//     },
//     tooltip: {
//         trigger: 'axis',
//         axisPointer: {
//             type: 'shadow',
//         },
//     },
//     legend: {
//         show: false,
//         type: 'plain', // 'scroll'
//         data: ['Octave 0', 'Octave 1', 'Octave 2', 'Octave 3', 'Octave 4', 'Octave 5', 'Octave 6', 'Octave 7', 'Octave 8'],
//     },
//     grid: {},
//     polar: {
//         center: ['50%', '50%'], 
//         radius: ['45%', '82%'],
//     },
//     radiusAxis: {
//         type: 'value',
//         show: false,
//         axisTick: {
//             show: false,
//         },
//     },
//     angleAxis: {
//         type: 'category',
//         show: true,
//         data: circleOfFifthsMajorOrderedNotes,
//         clockwise: true,
//         startAngle: 105,
//         splitArea: {
//             show: false,
//         },
//         axisLine: {
//             show: false,
//         },
//         axisTick: {
//             show: false,
//         },
//         axisLabel: {
//             interval: 0,
//             margin: 10,
//             color: '#234468',
//             color: '#ffffff',
//             fontFamily: '"Roboto Condensed", Verdana, sans-serif',
//             fontWeight: 600,
//             fontSize: 44,
//             formatter: (value, index) => {
//                 // ['C', 'G', 'D', 'A', 'E', 'B', 'Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F'];
//                 // ['C', 'G', 'D', 'A', 'E', 'B', 'G♭', 'D♭', 'A♭', 'E♭', 'B♭', 'F']; // undef ♭
//                 // ['C', 'G', 'D', 'A', 'E', 'B', 'F♯', 'C♯', 'G♯', 'D♯', 'A♯', 'F']; // undef ♯
//                 switch (value) {
//                     case 'Gb':
//                         return 'G♭';
//                     case 'Db':
//                             return 'D♭';
//                     case 'Ab':
//                             return 'A♭';
//                     case 'Eb':
//                         return 'E♭';
//                     case 'Bb':
//                         return 'B♭';
//                     default:
//                         return value;
//                 }
//             }
//         }
//     },
//     series: [
//         {
//             type: 'bar',
//             coordinateSystem: 'polar',
//             name: 'Octave 0',
//             stack: 'total',
//             barCategoryGap: 1,
//             data: fullCircleData[0],
//         },
//         {
//             type: 'bar',
//             coordinateSystem: 'polar',
//             name: 'Octave 1',
//             stack: 'total',
//             data: fullCircleData[1],
//         },
//         {
//             type: 'bar',
//             coordinateSystem: 'polar',
//             name: 'Octave 2',
//             stack: 'total',
//             data: fullCircleData[2],
//         },
//         {
//             type: 'bar',
//             coordinateSystem: 'polar',
//             name: 'Octave 3',
//             stack: 'total',
//             data: fullCircleData[3],
//         },
//         {
//             type: 'bar',
//             coordinateSystem: 'polar',
//             name: 'Octave 4',
//             stack: 'total',
//             data: fullCircleData[4],
//         },
//         {
//             type: 'bar',
//             coordinateSystem: 'polar',
//             name: 'Octave 5',
//             stack: 'total',
//             data: fullCircleData[5],
//         },
//         {
//             type: 'bar',
//             coordinateSystem: 'polar',
//             name: 'Octave 6',
//             stack: 'total',
//             data: fullCircleData[6],
//         },
//         {
//             type: 'bar',
//             coordinateSystem: 'polar',
//             name: 'Octave 7',
//             stack: 'total',
//             data: fullCircleData[7],
//         },
//         {
//             type: 'bar',
//             coordinateSystem: 'polar',
//             name: 'Octave 8',
//             stack: 'total',
//             data: fullCircleData[8],
//         },
//     ]
// };

waterfallChart.setOption(waterfallOption);
