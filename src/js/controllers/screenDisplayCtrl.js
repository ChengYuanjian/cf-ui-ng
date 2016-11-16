app.controller('ScreenDisplayCtrl', ['$rootScope', '$scope', '$timeout', '$log', '$interval', 'logService', 'spaceService', 'i18nService', 'notificationService', 'uiGridConstants', function ($rootScope, $scope, $timeout, $log, $interval, logService, spaceService, i18nService, notificationService, uiGridConstants) {


    var nationChart = echarts.init(document.getElementById('nation'));

    nationChart.dom.style.width = window.innerHeight / 2.5 + 'px';
    // nationChart.dom.style.height = window.innerHeight/2+'px';

    nationOption = {
        backgroundColor: '#1b1b1b',
        color: ['gold', 'aqua', 'lime'],
        title: {
            text: '全国访问统计',
            x: 'center',
            textStyle: {
                color: '#FFFFFF',
                fontSize: 14
            },
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}'
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            data: ['武汉 Top10'],
            selectedMode: 'single',
            textStyle: {
                color: '#fff'
            }
        },
        toolbox: {
            show: true,
            left: 'right',
            feature: {
                mark: {show: false},
                dataView: {show: false, readOnly: false},
                restore: {show: false},
                saveAsImage: {show: false}
            }
        },
        dataRange: {
            min: 0,
            max: 100,
            calculable: true,
            color: ['#ff3333', 'orange', 'yellow', 'lime', 'aqua'],
            textStyle: {
                color: '#fff'
            }
        },
        series: [
            {
                name: '全国',
                type: 'map',
                roam: true,
                hoverable: false,
                mapType: 'china',
                mapLocation: {x: 'center'},
                itemStyle: {
                    normal: {
                        borderColor: 'rgba(100,149,237,1)',
                        borderWidth: 0.5,
                        areaStyle: {
                            color: '#1b1b1b'
                        }
                    }
                },
                data: [],
                markLine: {
                    smooth: true,
                    symbol: ['none', 'circle'],
                    symbolSize: 1,
                    itemStyle: {
                        normal: {
                            color: '#fff',
                            borderWidth: 1,
                            borderColor: 'rgba(30,144,255,0.5)'
                        }
                    },
                    data: [
                        [{name: '武汉'}, {name: '包头'}],
                        [{name: '武汉'}, {name: '北海'}],
                        [{name: '武汉'}, {name: '广州'}],
                        [{name: '武汉'}, {name: '郑州'}],
                        [{name: '武汉'}, {name: '长春'}],
                        [{name: '武汉'}, {name: '长治'}],
                        [{name: '武汉'}, {name: '重庆'}],
                        [{name: '武汉'}, {name: '长沙'}],
                        [{name: '武汉'}, {name: '成都'}],
                        [{name: '武汉'}, {name: '常州'}],
                        [{name: '武汉'}, {name: '丹东'}],
                        [{name: '武汉'}, {name: '大连'}],
                        [{name: '武汉'}, {name: '东营'}],
                        [{name: '武汉'}, {name: '延安'}],
                        [{name: '武汉'}, {name: '福州'}],
                        [{name: '武汉'}, {name: '海口'}],
                        [{name: '武汉'}, {name: '呼和浩特'}],
                        [{name: '武汉'}, {name: '合肥'}],
                        [{name: '武汉'}, {name: '杭州'}],
                        [{name: '武汉'}, {name: '哈尔滨'}],
                        [{name: '武汉'}, {name: '舟山'}],
                        [{name: '武汉'}, {name: '银川'}],
                        [{name: '武汉'}, {name: '衢州'}],
                        [{name: '武汉'}, {name: '南昌'}],
                        [{name: '武汉'}, {name: '昆明'}],
                        [{name: '武汉'}, {name: '贵阳'}],
                        [{name: '武汉'}, {name: '兰州'}],
                        [{name: '武汉'}, {name: '拉萨'}],
                        [{name: '武汉'}, {name: '连云港'}],
                        [{name: '武汉'}, {name: '临沂'}],
                        [{name: '武汉'}, {name: '柳州'}],
                        [{name: '武汉'}, {name: '宁波'}],
                        [{name: '武汉'}, {name: '南京'}],
                        [{name: '武汉'}, {name: '南宁'}],
                        [{name: '武汉'}, {name: '南通'}],
                        [{name: '武汉'}, {name: '上海'}],
                        [{name: '武汉'}, {name: '沈阳'}],
                        [{name: '武汉'}, {name: '西安'}],
                        [{name: '武汉'}, {name: '汕头'}],
                        [{name: '武汉'}, {name: '深圳'}],
                        [{name: '武汉'}, {name: '青岛'}],
                        [{name: '武汉'}, {name: '济南'}],
                        [{name: '武汉'}, {name: '太原'}],
                        [{name: '武汉'}, {name: '乌鲁木齐'}],
                        [{name: '武汉'}, {name: '潍坊'}],
                        [{name: '武汉'}, {name: '威海'}],
                        [{name: '武汉'}, {name: '温州'}],
                        [{name: '武汉'}, {name: '武汉'}],
                        [{name: '武汉'}, {name: '无锡'}],
                        [{name: '武汉'}, {name: '厦门'}],
                        [{name: '武汉'}, {name: '西宁'}],
                        [{name: '武汉'}, {name: '徐州'}],
                        [{name: '武汉'}, {name: '烟台'}],
                        [{name: '武汉'}, {name: '盐城'}],
                        [{name: '武汉'}, {name: '珠海'}]
                    ],
                },
                geoCoord: {
                    '上海': [121.4648, 31.2891],
                    '东莞': [113.8953, 22.901],
                    '东营': [118.7073, 37.5513],
                    '中山': [113.4229, 22.478],
                    '临汾': [111.4783, 36.1615],
                    '临沂': [118.3118, 35.2936],
                    '丹东': [124.541, 40.4242],
                    '丽水': [119.5642, 28.1854],
                    '乌鲁木齐': [87.9236, 43.5883],
                    '佛山': [112.8955, 23.1097],
                    '保定': [115.0488, 39.0948],
                    '兰州': [103.5901, 36.3043],
                    '包头': [110.3467, 41.4899],
                    '北京': [116.4551, 40.2539],
                    '北海': [109.314, 21.6211],
                    '南京': [118.8062, 31.9208],
                    '南宁': [108.479, 23.1152],
                    '南昌': [116.0046, 28.6633],
                    '南通': [121.1023, 32.1625],
                    '厦门': [118.1689, 24.6478],
                    '台州': [121.1353, 28.6688],
                    '合肥': [117.29, 32.0581],
                    '呼和浩特': [111.4124, 40.4901],
                    '咸阳': [108.4131, 34.8706],
                    '哈尔滨': [127.9688, 45.368],
                    '唐山': [118.4766, 39.6826],
                    '嘉兴': [120.9155, 30.6354],
                    '大同': [113.7854, 39.8035],
                    '大连': [122.2229, 39.4409],
                    '天津': [117.4219, 39.4189],
                    '太原': [112.3352, 37.9413],
                    '威海': [121.9482, 37.1393],
                    '宁波': [121.5967, 29.6466],
                    '宝鸡': [107.1826, 34.3433],
                    '宿迁': [118.5535, 33.7775],
                    '常州': [119.4543, 31.5582],
                    '广州': [113.5107, 23.2196],
                    '廊坊': [116.521, 39.0509],
                    '延安': [109.1052, 36.4252],
                    '张家口': [115.1477, 40.8527],
                    '徐州': [117.5208, 34.3268],
                    '德州': [116.6858, 37.2107],
                    '惠州': [114.6204, 23.1647],
                    '成都': [103.9526, 30.7617],
                    '扬州': [119.4653, 32.8162],
                    '承德': [117.5757, 41.4075],
                    '拉萨': [91.1865, 30.1465],
                    '无锡': [120.3442, 31.5527],
                    '日照': [119.2786, 35.5023],
                    '昆明': [102.9199, 25.4663],
                    '杭州': [119.5313, 29.8773],
                    '枣庄': [117.323, 34.8926],
                    '柳州': [109.3799, 24.9774],
                    '株洲': [113.5327, 27.0319],
                    '武汉': [114.3896, 30.6628],
                    '汕头': [117.1692, 23.3405],
                    '江门': [112.6318, 22.1484],
                    '沈阳': [123.1238, 42.1216],
                    '沧州': [116.8286, 38.2104],
                    '河源': [114.917, 23.9722],
                    '泉州': [118.3228, 25.1147],
                    '泰安': [117.0264, 36.0516],
                    '泰州': [120.0586, 32.5525],
                    '济南': [117.1582, 36.8701],
                    '济宁': [116.8286, 35.3375],
                    '海口': [110.3893, 19.8516],
                    '淄博': [118.0371, 36.6064],
                    '淮安': [118.927, 33.4039],
                    '深圳': [114.5435, 22.5439],
                    '清远': [112.9175, 24.3292],
                    '温州': [120.498, 27.8119],
                    '渭南': [109.7864, 35.0299],
                    '湖州': [119.8608, 30.7782],
                    '湘潭': [112.5439, 27.7075],
                    '滨州': [117.8174, 37.4963],
                    '潍坊': [119.0918, 36.524],
                    '烟台': [120.7397, 37.5128],
                    '玉溪': [101.9312, 23.8898],
                    '珠海': [113.7305, 22.1155],
                    '盐城': [120.2234, 33.5577],
                    '盘锦': [121.9482, 41.0449],
                    '石家庄': [114.4995, 38.1006],
                    '福州': [119.4543, 25.9222],
                    '秦皇岛': [119.2126, 40.0232],
                    '绍兴': [120.564, 29.7565],
                    '聊城': [115.9167, 36.4032],
                    '肇庆': [112.1265, 23.5822],
                    '舟山': [122.2559, 30.2234],
                    '苏州': [120.6519, 31.3989],
                    '莱芜': [117.6526, 36.2714],
                    '菏泽': [115.6201, 35.2057],
                    '营口': [122.4316, 40.4297],
                    '葫芦岛': [120.1575, 40.578],
                    '衡水': [115.8838, 37.7161],
                    '衢州': [118.6853, 28.8666],
                    '西宁': [101.4038, 36.8207],
                    '西安': [109.1162, 34.2004],
                    '贵阳': [106.6992, 26.7682],
                    '连云港': [119.1248, 34.552],
                    '邢台': [114.8071, 37.2821],
                    '邯郸': [114.4775, 36.535],
                    '郑州': [113.4668, 34.6234],
                    '鄂尔多斯': [108.9734, 39.2487],
                    '重庆': [107.7539, 30.1904],
                    '金华': [120.0037, 29.1028],
                    '铜川': [109.0393, 35.1947],
                    '银川': [106.3586, 38.1775],
                    '镇江': [119.4763, 31.9702],
                    '长春': [125.8154, 44.2584],
                    '长沙': [113.0823, 28.2568],
                    '长治': [112.8625, 36.4746],
                    '阳泉': [113.4778, 38.0951],
                    '青岛': [120.4651, 36.3373],
                    '韶关': [113.7964, 24.7028]
                }
            },
            {
                name: '武汉 Top10',
                type: 'map',
                mapType: 'china',
                data: [],
                markLine: {
                    smooth: true,
                    effect: {
                        show: true,
                        scaleSize: 1,
                        period: 30,
                        color: '#fff',
                        shadowBlur: 10
                    },
                    itemStyle: {
                        normal: {
                            borderWidth: 1,
                            lineStyle: {
                                type: 'solid',
                                shadowBlur: 10
                            }
                        }
                    },
                    data: [
                        [{name: '武汉'}, {name: '上海', value: 95}],
                        [{name: '武汉'}, {name: '广州', value: 90}],
                        [{name: '武汉'}, {name: '大连', value: 80}],
                        [{name: '武汉'}, {name: '南宁', value: 70}],
                        [{name: '武汉'}, {name: '南昌', value: 60}],
                        [{name: '武汉'}, {name: '拉萨', value: 50}],
                        [{name: '武汉'}, {name: '长春', value: 40}],
                        [{name: '武汉'}, {name: '包头', value: 30}],
                        [{name: '武汉'}, {name: '重庆', value: 20}],
                        [{name: '武汉'}, {name: '常州', value: 10}]
                    ]
                },
                markPoint: {
                    symbol: 'emptyCircle',
                    symbolSize: function (v) {
                        return 10 + v / 10
                    },
                    effect: {
                        show: true,
                        shadowBlur: 0
                    },
                    itemStyle: {
                        normal: {
                            label: {show: false}
                        },
                        emphasis: {
                            label: {position: 'top'}
                        }
                    },
                    data: [
                        {name: '上海', value: 95},
                        {name: '广州', value: 90},
                        {name: '大连', value: 80},
                        {name: '南宁', value: 70},
                        {name: '南昌', value: 60},
                        {name: '拉萨', value: 50},
                        {name: '长春', value: 40},
                        {name: '包头', value: 30},
                        {name: '重庆', value: 20},
                        {name: '常州', value: 10}
                    ]
                }
            }
        ]
    };


    nationChart.setOption(nationOption);

    // window.addEventListener('resize', function () {
    //     nationChart.resize();
    // });

    var provinceChart = echarts.init(document.getElementById('province'));

    provinceChart.dom.style.width = window.innerHeight / 2.5 + 'px';

    var provinceOption = {
        title: {
            textStyle: {
                color: '#FFFFFF',
                fontSize: 14
            },
            text: '全省访问统计',
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}:{c}次'
        },
        toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
        },
        dataRange: {
            min: 0,
            max: 1000000,
            x: 'left',
            y: 'bottom',
            calculable: true,
            textStyle: {
                color: '#fff'
            }
        },
        series: [{
            name: '湖北省访问统计',
            type: 'map',
            mapType: '湖北', // 自定义扩展图表类型
            mapLocation: {x: 'center'},
            itemStyle: {
                normal: {
                    label: {
                        show: true
                    }
                },
                emphasis: {
                    label: {
                        show: true
                    }
                }
            },
            data: [
                {name: '武汉市', value: 932400},
                {name: '十堰市', value: 422300},
                {name: '襄樊市', value: 122300},
                {name: '随州市', value: 172400},
                {name: '孝感市', value: 482300},
                {name: '黄冈市', value: 221300},
                {name: '鄂州市', value: 420320},
                {name: '黄石市', value: 662060},
                {name: '咸宁市', value: 53200},
                {name: '仙桃市', value: 543200},
                {name: '天门市', value: 987200},
                {name: '潜江市', value: 876200},
                {name: '宜昌市', value: 565200},
                {name: '荆州市', value: 321200},
                {name: '恩施土家族苗族自治州', value: 231200},
            ]

        }]
    };

    provinceChart.setOption(provinceOption);


    var requestChart = echarts.init(document.getElementById('requestChart'));
    requestChart.dom.style.width = window.innerHeight / 1.7 + 'px';
    requestOption = {
        title: {
            textStyle: {
                color: '#FFFFFF',
                fontSize: 14
            },
            text: '最近一个月访问统计',
            x: 'left'
        },
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            top: '15%',
            left: '5%',
            right: '3%',
            bottom: '15%',
            containLabel: true
        },
        toolbox: {
            show: true,
            feature: {
                mark: {show: false},
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar']},
                restore: {show: true},
                saveAsImage: {show: false}
            }
        },
        calculable: true,
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            axisLabel: {
                rotate: 45,
                interval: 1,
                textStyle: {
                    color: '#FFFFFF'
                }
            }
        }],
        yAxis: [{
            type: 'value',
            axisLabel: {
                textStyle: {
                    color: '#FFFFFF'
                }
            }
        }],
        series: [{
            name: '访问次数',
            type: 'line',
            data: [12332, 12323, 43434, 23212, 54542, 77220, 120090, 23143, 8343, 32322, 55552, 12312],
            itemStyle: {
                normal: {
                    color: '#3398DB',
                    lineStyle: {
                        width: 3
                    }
                }
            }
        }]
    };


    // 使用刚指定的配置项和数据显示图表。
    requestChart.setOption(requestOption);


    loadOption = {
        title: {
            textStyle: {
                color: '#FFFFFF',
                fontSize: 14
            },
            text: '负载情况',
            x: 'left'
        },
        backgroundColor: '#1b1b1b',
        tooltip: {
            formatter: "{a} <br/>{c} {b}"
        },
        series: [
            {
                name: 'CPU',
                type: 'gauge',
                radius: '70%',
                center: ['24%', '50%'],
                min: 0,
                max: 100,
                splitNumber: 10,
                axisLine: {            // 坐标轴线
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: [[0.3, 'lime'], [0.8, '#1e90ff'], [1, '#ff4500']],
                        width: 3,
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                axisLabel: {            // 坐标轴小标记
                    textStyle: {       // 属性lineStyle控制线条样式
                        fontWeight: 'bolder',
                        color: '#fff',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                axisTick: {            // 坐标轴小标记
                    length: 15,        // 属性length控制线长
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: 'auto',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                splitLine: {           // 分隔线
                    length: 25,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        width: 3,
                        color: '#fff',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                pointer: {           // 分隔线
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 5
                },
                title: {
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        fontSize: 20,
                        fontStyle: 'italic',
                        color: '#fff',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                detail: {
                    backgroundColor: 'rgba(30,144,255,0.8)',
                    borderWidth: 1,
                    borderColor: '#fff',
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 5,
                    offsetCenter: [0, '50%'],       // x, y，单位px
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        color: '#fff'
                    }
                },
                data: [{value: 30, name: 'CPU'}]
            },
            {
                name: 'Memory',
                type: 'gauge',
                radius: '70%',
                center: ['70%', '50%'],
                min: 0,
                max: 100,
                splitNumber: 10,
                axisLine: {            // 坐标轴线
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: [[0.4, 'lime'], [0.9, '#1e90ff'], [1, '#ff4500']],
                        width: 3,
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                axisLabel: {            // 坐标轴小标记
                    textStyle: {       // 属性lineStyle控制线条样式
                        fontWeight: 'bolder',
                        color: '#fff',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                axisTick: {            // 坐标轴小标记
                    length: 15,        // 属性length控制线长
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: 'auto',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                splitLine: {           // 分隔线
                    length: 25,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        width: 3,
                        color: '#fff',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                pointer: {           // 分隔线
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 5
                },
                title: {
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        fontSize: 20,
                        fontStyle: 'italic',
                        color: '#fff',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                detail: {
                    backgroundColor: 'rgba(30,144,255,0.8)',
                    borderWidth: 1,
                    borderColor: '#fff',
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 5,
                    offsetCenter: [0, '50%'],       // x, y，单位px
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        color: '#fff'
                    }
                },
                data: [{value: 40, name: '内存'}]
            }
        ]
    };

    var loadChart = echarts.init(document.getElementById('loadChart'));
    loadChart.dom.style.width = window.innerHeight / 2.4 + 'px';
    loadChart.setOption(loadOption);

    window.addEventListener('resize', function () {
        loadOption.chart.resize();
        requestOption.chart.resize();
    });
}
]);
