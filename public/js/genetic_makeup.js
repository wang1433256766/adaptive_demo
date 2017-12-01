//取array 的unique 值。用法  arraryname.unique
Array.prototype.unique = function() {
    var res = [];
    var json = {};
    for (var i = 0; i < this.length; i++) {
        if (!json[this[i]]) {
            res.push(this[i]);
            json[this[i]] = 1;
        }
    }
    return res;
};
//对象数组根据多属性排序
var sortAnces = function(prop1, prop2) {
    return function(obj1, obj2) {
        //prop1
        var val1 = obj1[prop1];
        var val2 = obj2[prop1];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) { //1.isNaN() 函数可用于判断其参数是否是 NaN;2.如果对象的值无法转换为数字，那么 Number() 函数返回 NaN。
            val1 = Number(val1);
            val2 = Number(val2);
        }
        //prop2
        var val3 = obj1[prop2];
        var val4 = obj2[prop2];
        if (!isNaN(Number(val3)) && !isNaN(Number(val4))) { //1.isNaN() 函数可用于判断其参数是否是 NaN;2.如果对象的值无法转换为数字，那么 Number() 函数返回 NaN。
            val3 = Number(val3);
            val4 = Number(val4);
        }
        if (val1 < val2) {
            return -1;
        } else if (val1 > val2) {
            return 1;
        } else {
            if (val3 < val4) {
                return -1;
            } else if (val3 > val4) {
                return 1;
            } else {
                return 0;
            }
        }
    }
}
var tagpop = 'TBN';
var myChartPca = echarts.init(document.getElementById('pca')); //散点图
var myChartFst = echarts.init(document.getElementById('fst')); //拼图
var admixtureChart = echarts.init(document.getElementById('admixture')); //geo+pie
myChartPca.showLoading();
myChartFst.showLoading();
admixtureChart.showLoading();
var optionFst = {
    title: {
        text: 'Fst',
        x: 'center',
        y: 'center'
    },
    tooltip: {
        trigger: 'item',
        position: ['48.5%', '49.2%'],
        backgroundColor: 'grey',
        showContent: true,
        textStyle: {
            color: 'black',
            fontWeight: 'bold'
        },
        formatter: "Fst-{b} : {c}",
        borderColor: 'black',
    },
    series: [{
            name: 'Fst',
            type: 'pie',
            radius: ['10%', '80%'],
            roseType: 'area',
            z: 2,
            color: ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622'],
            data: '',
            labelLine: {
                normal: {
                    show: true,
                    length: 30,
                    length2: 0,
                    smooth: true,
                    lineStyle: {
                        color: '#ffffff'
                    }
                }
            },
            label: {
                normal: {
                    show: true,
                    textStyle: {
                        color: '#0000ff'
                    }
                }
            },
            itemStyle: {
                normal: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }, {
            name: '最大刻度',
            type: 'pie',
            radius: ['80%', '81%'],
            roseType: 'area',
            z: 1,
            data: [{
                value: 1,
                name: '最大刻度'
            }],
            hoverAnimation: false, //关闭鼠标点上去的放大动画效果
            itemStyle: {
                normal: {
                    color: "#f8f8f8"
                }
            },
            label: {
                normal: {
                    show: false
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            tooltip: {
                show: false
            }
        }, {
            name: '中间刻度',
            type: 'pie',
            radius: ['40%', '41%'],
            roseType: 'area',
            z: 1,
            data: [{
                value: 1,
                name: '中间刻度'
            }],
            hoverAnimation: false, //关闭鼠标点上去的放大动画效果
            itemStyle: {
                normal: {
                    color: "#f8f8f8"
                }
            },
            label: {
                normal: {
                    show: false
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            tooltip: {
                show: false
            }
        }

    ]
};
myChartFst.setOption(optionFst);
$(function() {
    /**
     * pca
     */
    $.get('../public/js/json/pca.json', function(item) {
        myChartPca.hideLoading();
        var pca_data = eval('(' + item.content + ')');
        plotmypca(pca_data, 'pca1', myChartPca);
    });
    /**
     * fst
     */
    $.get('../public/js/json/pie.phyli', function(item) {
        myChartFst.hideLoading();
        var optionHtml = "";
        var dataArr = []; //所有行的数据组成的数组，数组内是所有行的对象
        var peopleArr = []; //所有行内不同人群的数组
        var peopleTempArr = []; //peopleTempArr表示所有行内所有人群的数据
        //定义颜色数组
        var ancesColor = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];
        var lines = item.split(/[\r\n]+/g);
        for (var i = 0; i < lines.length - 1; i++) {
            var dataObj = {};
            var linesData = lines[i].replace(/\s+/g, ' ').split(' '); //将多个空格整合成一个空格，并按一个空格分割为数组
            dataObj.pop1 = linesData[0];
            dataObj.pop2 = linesData[1];
            dataObj.fst = linesData[2];
            dataObj.ances = linesData[3];
            dataArr.push(dataObj); //所有行的数据组成的数组，数组内是所有行的对象
        }

        //获取所有行内不同人群的数据
        for (var j = 0; j < dataArr.length; j++) { //peopleTempArr表示所有行内所有人群的数据
            peopleTempArr.push(dataArr[j].pop1);
        }
        for (var diffP = 0; diffP < peopleTempArr.length; diffP++) { //peopleArr表示所有行内不同人群的数据
            if (peopleArr.indexOf(peopleTempArr[diffP]) == -1) {
                peopleArr.push(peopleTempArr[diffP]);
            }
        }

        //将不同人群的数据添加到option框中
        for (var k = 0; k < peopleArr.length; k++) {
            optionHtml += '<option value="' + k + '">' + peopleArr[k] + '</option>';
        }
        $("#people").html(optionHtml);

        loadDiffPeople(dataArr, ancesColor);

        $("#people").change(function() {
            loadDiffPeople(dataArr, ancesColor);
        })

    });
    /**
     * admixture
     */
    $.get('../public/js/json/world.json', function(worldJson) {
        echarts.registerMap('world', worldJson);
        /**
         * 群体的大概位置分布，以及群体中各成分占比
         * 群体的位置根据群体经纬度设置，群体成分由群体中包含的个体的成分的平均值得来
         * 思路：先从数据中筛选出所有群体，再算出每个群体对应成分的值
         */
        $.get('../public/js/json/admixtrue.json', function(item) {
            admixtureChart.hideLoading();
            var admix_data = eval('(' + item.content + ')');
            admix_data.sort(sortAnces("name", "indiv_name"));
            //console.log(admix_data);
            var diffPopArr = [];
            var diffPopPositionArr = [];
            //将不同的群体提取出来
            for (var i = 0; i < admix_data.length; i++) {
                if (diffPopArr.indexOf(admix_data[i].name) == -1) {
                    var diffPopPositionObj = {};
                    diffPopArr.push(admix_data[i].name);
                    diffPopPositionObj.name = admix_data[i].name;
                    diffPopPositionObj.latitude = admix_data[i].latitude;
                    diffPopPositionObj.longitude = admix_data[i].longitude;
                    diffPopPositionArr.push(diffPopPositionObj);
                }
            };
            var seriesArr = [{
                name: 'pop',
                type: 'map',
                mapType: 'world',
                roam: false,
                label: {
                    normal: {
                        show: false
                    }
                },
                //world-map下的个群体name
                data: function() {
                    var popNameArr = [];
                    for (var i = 0; i < diffPopArr.length; i++) {
                        var popNameObj = {};
                        popNameObj.name = diffPopArr[i];
                        popNameArr.push(popNameObj);
                    }
                    return popNameArr;
                }()
            }];
            //每个群体的成分占比
            for (var j = 0; j < diffPopArr.length; j++) {
                var seriesObj = {};
                seriesObj.name = diffPopArr[j];
                seriesObj.type = 'pie';
                seriesObj.radius = '10%';
                seriesObj.center = [];
                seriesObj.data = function() { //各群体所包含的成分(k1~k20)
                    var resArr = []; //[{name:k1,value:'0.00987'}]
                    var count = 0; //某群体中的个体数量
                    var k1_totalVal = 0,
                        k2_totalVal = 0,
                        k3_totalVal = 0,
                        k4_totalVal = 0,
                        k5_totalVal = 0,
                        k6_totalVal = 0,
                        k7_totalVal = 0,
                        k8_totalVal = 0,
                        k9_totalVal = 0,
                        k10_totalVal = 0,
                        k11_totalVal = 0,
                        k12_totalVal = 0,
                        k13_totalVal = 0,
                        k14_totalVal = 0,
                        k15_totalVal = 0,
                        k16_totalVal = 0,
                        k17_totalVal = 0,
                        k18_totalVal = 0,
                        k19_totalVal = 0,
                        k20_totalVal = 0
                    for (var k = 0; k < admix_data.length; k++) {
                        if (diffPopArr[j] == admix_data[k].name) {
                            count++;
                            k1_totalVal = floatObj.add(k1_totalVal, admix_data[k].k1);
                            k2_totalVal = floatObj.add(k2_totalVal, admix_data[k].k2);
                            k3_totalVal = floatObj.add(k3_totalVal, admix_data[k].k3);
                            k4_totalVal = floatObj.add(k4_totalVal, admix_data[k].k4);
                            k5_totalVal = floatObj.add(k5_totalVal, admix_data[k].k5);
                            k6_totalVal = floatObj.add(k6_totalVal, admix_data[k].k6);
                            k7_totalVal = floatObj.add(k7_totalVal, admix_data[k].k7);
                            k8_totalVal = floatObj.add(k8_totalVal, admix_data[k].k8);
                            k9_totalVal = floatObj.add(k9_totalVal, admix_data[k].k9);
                            k10_totalVal = floatObj.add(k10_totalVal, admix_data[k].k10);
                            k11_totalVal = floatObj.add(k11_totalVal, admix_data[k].k11);
                            k12_totalVal = floatObj.add(k12_totalVal, admix_data[k].k12);
                            k13_totalVal = floatObj.add(k13_totalVal, admix_data[k].k13);
                            k14_totalVal = floatObj.add(k14_totalVal, admix_data[k].k14);
                            k15_totalVal = floatObj.add(k15_totalVal, admix_data[k].k15);
                            k16_totalVal = floatObj.add(k16_totalVal, admix_data[k].k16);
                            k17_totalVal = floatObj.add(k17_totalVal, admix_data[k].k17);
                            k18_totalVal = floatObj.add(k18_totalVal, admix_data[k].k18);
                            k19_totalVal = floatObj.add(k19_totalVal, admix_data[k].k19);
                            k20_totalVal = floatObj.add(k20_totalVal, admix_data[k].k20);
                        }
                    }
                    for (var n = 1; n <= 20; n++) {
                        var resObj = {};
                        resObj.name = 'k' + n;
                        if (n == 1) {
                            resObj.value = floatObj.divide(k1_totalVal, count);
                        } else if (n == 2) {
                            resObj.value = floatObj.divide(k2_totalVal, count);
                        } else if (n == 3) {
                            resObj.value = floatObj.divide(k3_totalVal, count);
                        } else if (n == 4) {
                            resObj.value = floatObj.divide(k4_totalVal, count);
                        } else if (n == 5) {
                            resObj.value = floatObj.divide(k5_totalVal, count);
                        } else if (n == 6) {
                            resObj.value = floatObj.divide(k6_totalVal, count);
                        } else if (n == 7) {
                            resObj.value = floatObj.divide(k7_totalVal, count);
                        } else if (n == 8) {
                            resObj.value = floatObj.divide(k8_totalVal, count);
                        } else if (n == 9) {
                            resObj.value = floatObj.divide(k9_totalVal, count);
                        } else if (n == 10) {
                            resObj.value = floatObj.divide(k10_totalVal, count);
                        } else if (n == 11) {
                            resObj.value = floatObj.divide(k11_totalVal, count);
                        } else if (n == 12) {
                            resObj.value = floatObj.divide(k12_totalVal, count);
                        } else if (n == 13) {
                            resObj.value = floatObj.divide(k13_totalVal, count);
                        } else if (n == 14) {
                            resObj.value = floatObj.divide(k14_totalVal, count);
                        } else if (n == 15) {
                            resObj.value = floatObj.divide(k15_totalVal, count);
                        } else if (n == 16) {
                            resObj.value = floatObj.divide(k16_totalVal, count);
                        } else if (n == 17) {
                            resObj.value = floatObj.divide(k17_totalVal, count);
                        } else if (n == 18) {
                            resObj.value = floatObj.divide(k18_totalVal, count);
                        } else if (n == 19) {
                            resObj.value = floatObj.divide(k19_totalVal, count);
                        } else if (n == 20) {
                            resObj.value = floatObj.divide(k20_totalVal, count);
                        }
                        resArr.push(resObj);
                    }
                    return resArr;
                }();
                seriesArr.push(seriesObj);
            }
            var option = {
                //backgroundColor: 'white',
                tooltip: {
                    trigger: 'item'
                },
                visualMap: {
                    min: 0,
                    max: 1,
                    left: 'left',
                    text: ['高', '低'],
                    calculable: true,
                    color: ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3', '#ff3333', 'orange', 'yellow', 'lime', 'aqua']
                },
                series: seriesArr
            }
            admixtureChart.setOption(option);
            admixtureChart.setOption({
                series: function() {
                    var positionArr = [];
                    for (var i = 0; i < diffPopPositionArr.length; i++) {
                        var positionObj = {};
                        positionObj.name = diffPopPositionArr[i].name;
                        positionObj.center = admixtureChart.convertToPixel({ seriesIndex: 0 }, [diffPopPositionArr[i].latitude, diffPopPositionArr[i].longitude]);
                        positionArr.push(positionObj);
                    }
                    return positionArr;
                }()
            });
        })
    })

    window.addEventListener("resize", function() {
        myChartPca.resize();
        myChartFst.resize();
        admixtureChart.resize();
    });

})

function getPcaDataById(res, pcaindex) {
    var ancescolor = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3', "#000000", "#000080", "#3CB371", "#FF8C00", "#FF0000", "#6495ED", "#FF1493", "#00BFFF", "cyan"];
    var popscolor = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3', "#000000", "#000080", "#3CB371", "#FF8C00", "#FF0000", "#6495ED", "#FF1493", "#00BFFF", "cyan"];
    var pca = res[pcaindex]; //获得第几组pca
    if (!pca) {
        return '';
    } else {
        var ances = [];
        var pops = [];
        for (var i = 0; i < pca.length; i++) {
            ances.push(pca[i].ancestry);
            pops.push(pca[i].name); // population name
        }
        ances = ances.unique(); //统计ances array. 去重复;
        ances.sort();
        pops = pops.unique();
        pops.sort();
        var mydata = []; // array. store the pcas for each ancestry. ances[0]'s pca information is pca[0]
        var type, colors;
        //如果是pop 的数量很少，将以人群去显示legend,否则以ances 去显示legend
        if (pops.length > 20) {
            for (var a = 0; a < ances.length; a++) {
                var data = [];
                for (var i = 0; i < pca.length; i++) {
                    if (pca[i].ancestry == ances[a]) {
                        //var oneind=[pca[i].pc1,pca[i].pc2,pca[i].indiv_name,pca[i].name,pca[i].ancestry,mypop_fullname[pca[i].name]];
                        //data.push(oneind);
                        if (pca[i].name != tagpop) {
                            var oneind = [pca[i].pc1, pca[i].pc2, pca[i].indiv_name, pca[i].name, pca[i].ancestry];
                            data.push(oneind);
                        }
                    }

                }
                mydata.push(data);
            }

            var data_pop = [];
            for (var i = 0; i < pca.length; i++) {
                if (pca[i].name == tagpop) {
                    var onepop = [pca[i].pc1, pca[i].pc2, pca[i].indiv_name, pca[i].name, pca[i].ancestry];
                    data_pop.push(onepop);
                }
            }
            type = ances;
            if (data_pop.length > 0) {
                mydata.push(data_pop);
                type.push(tagpop);
            }
            colors = ancescolor;
        } else {
            for (var a = 0; a < pops.length; a++) {
                var data = [];
                for (var i = 0; i < pca.length; i++) {
                    if (pca[i].name == pops[a]) {
                        var oneind = [pca[i].pc1, pca[i].pc2, pca[i].indiv_name, pca[i].name, pca[i].ancestry];
                        data.push(oneind);
                    }
                }
                mydata.push(data);
                colors = popscolor;
            }
            type = pops;
        }
        var obj = new Object();
        obj.type = type;
        obj.data = mydata;
        obj.colors = colors;
        obj.title = pca[0].title;
        return obj;
    }
}

//准备画PCA的数据系列。
function pca_series(res, pcaindex) {
    var pcadata = getPcaDataById(res, pcaindex);
    if (pcadata != "") {
        var type = pcadata.type;
        var data = pcadata.data;
        var colors = pcadata.colors;
        var series = []; // series in pca
        for (var i = 0; i < type.length; i++) {
            var obj = {
                name: type[i],
                data: data[i],
                type: 'scatter',
                symbolSize: function(data) {
                    return 10;
                },
                label: {
                    emphasis: {
                        show: false,
                        formatter: function(param) {
                            return param.data[3];
                        },
                        position: 'top',
                        textStyle: {
                            //color:'black',
                            //fontWeight:'bold',
                            fontSize: 14
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                            offset: 0,
                            color: colors[i]
                        }, {
                            offset: 1,
                            color: colors[i]
                        }])
                    }
                }
            };
            series.push(obj);
        };
        pcadata.series = series;
        return pcadata;
    } else {
        return '';
    }
}

function plotmypca(res, pcaindex, pcaEcharts) {
    //for pca data
    var pcadata = pca_series(res, pcaindex);
    if (pcadata != '') {
        var series = pcadata.series;
        var type = pcadata.type;
        //for pca region

        pcaplot = {
            // backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [{
            //     offset: 0,
            //     color: 'white'
            // }, {
            //     offset: 1,
            //     color: 'white'
            // }]),
            title: {
                text: pcadata.title,
                padding: [0, 0, 50, 50],
                textStyle: {
                    fontFamily: "Calibri",
                    fontSize: 20,
                },
            },
            grid: {
                top: 100
            },
            //数据区域缩放、滚动条
            dataZoom: [{
                    type: 'slider',
                    show: false,
                    xAxisIndex: [0],
                    start: 1,
                    end: 100
                },
                {
                    type: 'slider',
                    show: false,
                    yAxisIndex: [0],
                    left: '93%',
                    start: 1,
                    end: 100
                },
                {
                    type: 'inside',
                    xAxisIndex: [0],
                    start: 1,
                    end: 100
                },
                {
                    type: 'inside',
                    yAxisIndex: [0],
                    start: 1,
                    end: 100
                }
            ],
            toolbox: {
                show: true,
                orient: 'horizontal',
                top: 15,
                right: 45,
                feature: {
                    dataView: {
                        show: true,
                        readOnly: false,
                        title: 'Data View',
                        lang: ['', 'Close', 'Refresh']
                    },
                    restore: {
                        show: true,
                        title: "Restore"
                    },
                    saveAsImage: {
                        type: 'jpeg',
                        show: true,
                        title: 'Save Image',
                        pixelRatio: 2
                    }
                }
            },
            tooltip: {
                padding: 10,
                formatter: function(obj) {
                    var value = obj.value;
                    return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">' +
                        "sample: " + value[2] +
                        '</div>' +
                        "Pop. symbol: " + value[3] + '<br>' +
                        // "Pop. name: " + value[5] + '<br>' +
                        "Region: " + value[4] + '<br>' +
                        "PC1: " + value[0] + '<br>' +
                        "PC2: " + value[1] + '<br>'
                }
            },
            legend: {
                //right: 20,
                padding: [
                    50,
                    50,
                    500,
                    50
                ],
                left: 10,
                //top:10,
                //bottom:50,
                //data: ['1990', '2015'],
                data: type,
                itemGap: 5,
                //orient:'vertical'
            },
            xAxis: {
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                },
                name: 'PC1',
                nameLocation: 'middle',
                nameTextStyle: {
                    fontSize: 20
                },
                nameGap: 35
            },
            yAxis: {
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                },
                scale: true,
                name: 'PC2',
                nameLocation: 'middle',
                nameTextStyle: {
                    fontSize: 20.
                },
                nameGap: 60
            },
            color: ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3', "#000000", "#000080", "#3CB371", "#FF8C00", "#FF0000", "#6495ED", "#FF1493", "#00BFFF", "cyan"],
            series: series
        };
        pcaEcharts.setOption(pcaplot);
    }
}

function loadDiffPeople(dataArr, ancesColor) {
    var personArr = []; //属于同一人群的所有数据
    var ancesTempArr = []; //同一人群中所有的祖先数据
    var ancesArr = []; //同一人群中不同祖先的数据
    var selectPeople = $("#people option:selected").text();
    //根据option的选择，获取所选择人群的所有数据
    for (var p = 0; p < dataArr.length; p++) {
        if (selectPeople == dataArr[p].pop1) {
            personArr.push(dataArr[p]); //personArr是属于同一人群的所有数据
        } else {
            if (selectPeople == dataArr[p].pop2) {
                var tempDataArr = dataArr[p];
                tempDataArr.pop2 = tempDataArr.pop1;
                tempDataArr.pop1 = selectPeople;
                personArr.push(tempDataArr);
            }
        }
    }
    personArr.sort(sortAnces("ances", "fst"));

    //获取同一人群不同祖先的数据
    for (var q = 0; q < personArr.length; q++) {
        ancesTempArr.push(personArr[q].ances); //同一人群所有祖先的数据
    }
    for (var diffA = 0; diffA < ancesTempArr.length; diffA++) { //ancesArr表示同一人群内不同祖先的数据
        if (ancesArr.indexOf(ancesTempArr[diffA]) == -1) {
            ancesArr.push(ancesTempArr[diffA]);
        }
    }
    //ancesArr = ancesArr.unique(); //同一人群不同祖先的数据
    //console.log(ancesArr);

    //给不同的祖先分配不同的颜色
    for (var r in ancesArr) {
        for (var o in personArr) {
            if (personArr[o].ances == ancesArr[r]) {
                personArr[o].color = ancesColor[r];
            }
        }
    }

    var classZ = '';
    $("#classZ").html('');
    //加legend按钮
    for (var a = 0; a < ancesArr.length; a++) {
        classZ += '<button class="legendsty" value="' + ancesArr[a] + '" name="' + ancesColor[a] + '" style="background:' + ancesColor[a] + ';"></button><span>' + ancesArr[a] + '</span>';
    }
    $("#classZ").html(classZ);
    loadEcharts(personArr);
    var nochange_personArr = personArr;

    //点击legend
    $(".legendsty").click(function() {
        var partPersonArr = get(nochange_personArr, 'ances', this.value);
        var soureColor = this.name;
        if (this.style.background != 'rgb(238, 238, 238)') {
            this.style.background = '#eeeeee';
            personArr = remove(personArr, 'ances', this.value);
            personArr.sort(sortAnces("ances", "fst"));
            loadEcharts(personArr);
        } else {
            this.style.background = soureColor;
            Array.prototype.push.apply(personArr, partPersonArr);
            personArr.sort(sortAnces("ances", "fst"));
            loadEcharts(personArr);
        }
    })

}

function loadEcharts(personArr) {
    var flagAA;
    if (personArr.length > 30) {
        flagAA = false;
    } else {
        flagAA = true;
    }
    myChartFst.setOption({
        title: {
            text: 'AA',
        },
        tooltip: {
            trigger: 'item',
            formatter: "AA-{b} : {c}"
        },
        series: [{
            name: 'Fst',
            type: 'pie',
            color: function() {
                var color = [];
                for (var i in personArr) {
                    color.push(personArr[i].color);
                }
                return color;
            }(),
            data: function() {
                var data = [];
                for (var i in personArr) {
                    data.push({ 'name': personArr[i].pop2, 'value': personArr[i].fst });
                }
                return data;
            }(),
            labelLine: {
                normal: {
                    show: flagAA,
                    length: 30,
                    length2: 0,
                    smooth: true,
                    lineStyle: {
                        color: '#ffffff'
                    }
                },
                emphasis: {
                    show: flagAA
                }
            },
            label: {
                normal: {
                    show: flagAA,
                    textStyle: {
                        color: '#0000ff'
                    }
                },
                emphasis: {
                    show: flagAA
                }
            },
            itemStyle: {
                normal: {
                    //color: "#ff0000",
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    });
}

/**
 * 从对象数组中删除属性为objPropery，值为objValue元素的对象
 * @param Array arrPerson  数组对象
 * @param String objPropery  对象的属性
 * @param String objPropery  对象的值
 * @return Array 过滤后数组
 */
function remove(arrPerson, objPropery, objValue) {
    return $.grep(arrPerson, function(cur, i) {
        return cur[objPropery] != objValue;
    });
}

/**
 * 从对象数组中获取属性为objPropery，值为objValue元素的对象
 * @param Array arrPerson  数组对象
 * @param String objPropery  对象的属性
 * @param String objPropery  对象的值
 * @return Array 过滤后的数组
 */
function get(arrPerson, objPropery, objValue) {
    return $.grep(arrPerson, function(cur, i) {
        return cur[objPropery] == objValue;
    });
}