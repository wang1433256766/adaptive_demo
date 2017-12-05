var tagpop = 'Han';
var myChartPca1 = echarts.init(document.getElementById('pca1')); //散点图
var myChartPca2 = echarts.init(document.getElementById('pca2')); //散点图
var myChartPca3 = echarts.init(document.getElementById('pca3')); //散点图
var myChartFst = echarts.init(document.getElementById('fst')); //饼图
var admixtureChart = echarts.init(document.getElementById('admixture')); //geo+pie
var admixture2Chart = echarts.init(document.getElementById('admixture2')); //bar+polar
myChartPca1.showLoading();
myChartPca2.showLoading();
myChartPca3.showLoading();
myChartFst.showLoading();
admixtureChart.showLoading();
admixture2Chart.showLoading();
$(function() {
    /**
     * pca (pca1,pca2,pca3)
     */
    $.get('../public/js/json/pca.json', function(item) {
        myChartPca1.hideLoading();
        myChartPca2.hideLoading();
        myChartPca3.hideLoading();
        var pca_data = eval('(' + item.content + ')');
        $("#area").find('option').eq(0).text(pca_data.pca2[0].title);
        $("#area").find('option').eq(1).text(pca_data.pca3[0].title);
        $("#area-1").find('option').eq(0).text(pca_data.pca2[0].title);
        $("#area-1").find('option').eq(1).text(pca_data.pca3[0].title);
        plotmypca(pca_data, 'pca1', myChartPca1);
        plotmypca(pca_data, 'pca2', myChartPca2);
        plotmypca(pca_data, 'pca3', myChartPca3);
        $("#area").change(function() {
            var pca_value = $("#area option:selected").val();
            if (pca_value == 'pca2') {
                $("#area-1").val('pca2-1');
                $("#pca2").removeClass('hidden');
                $("#pca3").addClass('hidden');
                myChartPca2.resize();
            }
            if (pca_value == 'pca3') {
                $("#area-1").val('pca3-1');
                $("#pca2").addClass('hidden');
                $("#pca3").removeClass('hidden');
                myChartPca3.resize();
            }
        });
        $("#area-1").change(function() {
            var pca_value = $("#area-1 option:selected").val();
            if (pca_value == 'pca2-1') {
                $("#area").val('pca2');
                $("#pca2").removeClass('hidden');
                $("#pca3").addClass('hidden');
                myChartPca2.resize();
            }
            if (pca_value == 'pca3-1') {
                $("#area").val('pca3');
                $("#pca2").addClass('hidden');
                $("#pca3").removeClass('hidden');
                myChartPca3.resize();
            }
        })
    });
    /**
     * fst
     */
    $.get('../public/js/json/fst.json', function(item) {
        myChartFst.hideLoading();
        var fst_data = eval('(' + item.content + ')');
        //console.log(fst_data);
        //定义颜色数组
        var ancesColor = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];

        loadDiffPeople(fst_data, ancesColor);
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
                    show: false,
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

    /**
     * admixture2
     */
    $.get('../public/js/json/admixture_han.json', function(item) {
        admixture2Chart.hideLoading();
        var admixture2_data = eval('(' + item.content + ')');
        var k_data = {};
        for (var i = 0; i < 20; i++) {
            var kn_dataArr = [];
            for (var j = 0; j < admixture2_data.length; j++) {
                kn_dataArr.push({ value: admixture2_data[j]['k' + (i + 1)], sample: admixture2_data[j].indiv_name });
            }
            k_data['k' + (i + 1)] = kn_dataArr;
        };
        admixture2Chart.setOption({
            legend: {
                show: true,
                data: function() {
                    var legend_data = [];
                    for (var i = 0; i < 20; i++) {
                        legend_data.push('k' + (i + 1));
                    }
                    return legend_data;
                }()
            },
            tooltip: {
                show: true,
                trigger: 'axis',
                formatter: function(params) {
                    //console.log(params);
                    var returnVal = params[0].data.sample + "--" + params[0].name + "<br>";
                    for (var i = 0; i < params.length; i++) {
                        if (i == 5 || i == 10 || i == 15) {
                            returnVal += '<br>';
                        }
                        returnVal += params[i].seriesName + " : " + params[i].value + ";&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                    }
                    return returnVal;
                }
            },
            angleAxis: {
                type: 'category',
                boundaryGap: true,
                data: function() {
                    var x_data = [];
                    for (var i = 0; i < admixture2_data.length; i++) {
                        x_data.push(admixture2_data[i].name);
                    }
                    //console.log(x_data.unique());
                    return x_data;
                }(),
                z: 10,
                axisTick: {
                    interval: function(index, name) {
                        console.log(index + '---' + name);
                        return false;
                    }
                },
                axisLabel: {
                    interval: function(index, name) {
                        console.log(index + '---' + name);
                        return false;
                    }
                }
            },
            radiusAxis: {
                name: 'Proportion',
                boundaryGap: true,
                min: '-1',
                max: 'dataMax'
            },
            polar: {},
            color: ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3',
                "#000000", "#000080", "#3CB371", "#FF8C00", "#FF0000", "#6495ED", "#FF1493", "#00BFFF", "cyan"
            ],
            series: function() {
                var series_data = [];
                for (var i = 0; i < 20; i++) {
                    var series_dataObj = {};
                    series_dataObj.name = 'k' + (i + 1);
                    series_dataObj.type = 'bar';
                    series_dataObj.coordinateSystem = 'polar';
                    series_dataObj.stack = 'k';
                    series_dataObj.data = k_data['k' + (i + 1)];
                    series_data.push(series_dataObj);
                }
                return series_data;
            }()
        })

    });

    window.addEventListener("resize", function() {
        myChartPca1.resize();
        myChartPca2.resize();
        myChartPca3.resize();
        myChartFst.resize();
        admixtureChart.resize();
        admixture2Chart.resize();
    });

})

function getPcaDataById(res, pcaindex) {
    var color = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3', "#000000", "#000080", "#3CB371", "#FF8C00", "#FF0000", "#6495ED", "#FF1493", "#00BFFF", "cyan"];
    var pca = res[pcaindex]; //获得第几组pca
    if (!pca) {
        return '';
    } else {
        var ances = [], //祖源
            pops = []; //人群
        for (var i = 0; i < pca.length; i++) {
            ances.push(pca[i].ancestry);
            pops.push(pca[i].name); // population name
        }
        ances = ances.unique().sort(); //统计ances array. 去重复排序;
        pops = pops.unique().sort();
        var mydata = []; // 二维数组，表示各祖先包含的数据形成的数组，其中不包括群体为汉族的数据
        var type;
        //如果是pop 的数量少于20，将以pop(人群)去显示legend,否则以ances 去显示legend
        if (pops.length > 20) {
            for (var a = 0; a < ances.length; a++) {
                var data = []; //各祖先数据
                for (var i = 0; i < pca.length; i++) {
                    if (pca[i].ancestry == ances[a]) {
                        if (pca[i].name != tagpop) {
                            var oneind = [pca[i].pc1, pca[i].pc2, pca[i].indiv_name, pca[i].name, pca[i].ancestry];
                            data.push(oneind);
                        }
                    }
                }
                mydata.push(data);
            }
            //获得所有汉族的数据
            var data_pop = [];
            for (var i = 0; i < pca.length; i++) {
                if (pca[i].name == tagpop) {
                    var onepop = [pca[i].pc1, pca[i].pc2, pca[i].indiv_name, pca[i].name, pca[i].ancestry];
                    data_pop.push(onepop);
                }
            }
            type = ances;
            if (data_pop.length > 0) {
                mydata.push(data_pop); //将汉族的数据数组加入到祖先数据数组中
                type.push(tagpop);
            }
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
            }
            type = pops;
        }
        var obj = new Object();
        obj.type = type;
        obj.data = mydata;
        obj.colors = color;
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
                padding: [50, 50, 500, 50],
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
            color: pcadata.colors,
            series: series
        };
        pcaEcharts.setOption(pcaplot);
    }
}

function loadDiffPeople(fst_data, ancesColor) {
    var personArr = []; //Han人群的所有数据
    var ancesTempArr = []; //同一人群中所有的祖先数据
    var ancesArr = []; //同一人群中不同祖先的数据
    for (var i = 0; i < fst_data.length; i++) {
        if ('Han' == fst_data[i].pop1) {
            personArr.push(fst_data[i]); //personArr是属于同一人群的所有数据
        } else {
            if ('Han' == fst_data[i].pop2) {
                var tempDataArr = fst_data[i];
                tempDataArr.pop2 = tempDataArr.pop1;
                tempDataArr.pop1 = 'Han';
                personArr.push(tempDataArr);
            }
        }
    }
    personArr.sort(sortAnces("ances", "fst"));

    /**
     * 获取同一人群不同祖先的数据
     */
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
            text: 'Han',
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
            formatter: "Han-{b} : {c}",
            borderColor: 'black',
        },
        series: [{
            name: 'Fst',
            type: 'pie',
            radius: ['10%', '80%'],
            roseType: 'area',
            z: 2,
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
                    color: "#666"
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
                    color: "#666"
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