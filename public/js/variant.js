var admixtureChart = echarts.init(document.getElementById('admixture')); //geo+pie
admixtureChart.showLoading();
$(function() {
    /**
     * admixture
     * '../public/js/json/admixtrue.json'
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
            loadDiffKGeoAdmixtrue(admix_data, 5);
        })
    })
})

function loadDiffKGeoAdmixtrue(admix_data, whichk) {
    admix_data.sort(sortAnces("name", "indivName"));
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
        roam: true,
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
        seriesObj.radius = '5%';
        seriesObj.center = [];
        seriesObj.label = { normal: { show: false } };
        seriesObj.labelLine = { normal: { show: false } };
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
                k20_totalVal = 0;
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
            };
            for (var n = 1; n <= whichk; n++) {
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
            //console.log(resArr);
            return resArr;
        }();
        seriesArr.push(seriesObj);
    };
    //console.log(seriesArr);
    var option = {
        //backgroundColor: 'white',
        tooltip: {
            trigger: 'item'
        },
        // visualMap: {
        //     show: false,
        //     min: 0,
        //     max: 1,
        //     left: 'left',
        //     text: ['高', '低'],
        //     calculable: true,
        //     color: ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3', '#ff3333', 'orange', 'yellow', 'lime', 'aqua']
        // },
        color: ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3',
            "#000000", "#000080", "#3CB371", "#FF8C00", "#FF0000", "#6495ED", "#FF1493", "#00BFFF", "cyan"
        ],
        series: seriesArr
    }
    admixtureChart.setOption(option, true);
    admixtureChart.setOption({
        series: function() {
            var positionArr = [];
            for (var i = 0; i < diffPopPositionArr.length; i++) {
                var positionObj = {};
                positionObj.name = diffPopPositionArr[i].name;
                positionObj.center = admixtureChart.convertToPixel({ seriesIndex: 0 }, [diffPopPositionArr[i].longitude, diffPopPositionArr[i].latitude]);
                positionArr.push(positionObj);
            }
            return positionArr;
        }()
    });
    window.addEventListener("resize", function() {
        admixtureChart.setOption({
            series: function() {
                var positionArr = [];
                for (var i = 0; i < diffPopPositionArr.length; i++) {
                    var positionObj = {};
                    positionObj.name = diffPopPositionArr[i].name;
                    positionObj.center = admixtureChart.convertToPixel({ seriesIndex: 0 }, [diffPopPositionArr[i].longitude, diffPopPositionArr[i].latitude]);
                    positionArr.push(positionObj);
                }
                return positionArr;
            }()
        });
    });
    //饼图随地图移动
    admixtureChart.on("geoRoam", function() {
        admixtureChart.setOption({
            series: function() {
                var positionArr = [];
                for (var i = 0; i < diffPopPositionArr.length; i++) {
                    var positionObj = {};
                    positionObj.name = diffPopPositionArr[i].name;
                    positionObj.center = admixtureChart.convertToPixel({ seriesIndex: 0 }, [diffPopPositionArr[i].longitude, diffPopPositionArr[i].latitude]);
                    positionArr.push(positionObj);
                }
                return positionArr;
            }()
        });
    })
}