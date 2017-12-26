//例子效果
particlesJS("particles-js", {
    "particles": {
        "number": {
            "value": 20, //点的数量
            "density": { //密度
                "enable": true,
                "value_area": 800
            }
        },
        "color": {
            "value": "#dedede" //中心圆的颜色
        },
        "shape": {
            "type": "circle",
            "stroke": {
                "width": 20, //圆外边框的宽度
                "color": "#dedede" //圆外边框的颜色
            },
            "polygon": { //多边形
                "nb_sides": 10
            },
            "image": {
                "src": "img/github.svg",
                "width": 100,
                "height": 100
            }
        },
        "opacity": { //透明度
            "value": 0.5,
            "random": false, //随机的
            "anim": { //生动的
                "enable": false,
                "speed": 1,
                "opacity_min": 0.1,
                "sync": false
            }
        },
        "size": {
            "value": 3,
            "random": true,
            "anim": {
                "enable": false,
                "speed": 40,
                "size_min": 0.1,
                "sync": false
            }
        },
        "line_linked": {
            "enable": true,
            "distance": 200, //线长度
            "color": "#999999", //显得颜色
            "opacity": 0.6,
            "width": 1
        },
        "move": {
            "enable": true,
            "speed": 2, //运行速度
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
                "enable": false,
                "rotateX": 600,
                "rotateY": 1200
            }
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": true,
                "mode": "grab"
            },
            "onclick": {
                "enable": true,
                "mode": "push"
            },
            "resize": true
        },
        "modes": {
            "grab": {
                "distance": 140,
                "line_linked": {
                    "opacity": 1
                }
            },
            "bubble": {
                "distance": 400,
                "size": 40,
                "duration": 2,
                "opacity": 8,
                "speed": 3
            },
            "repulse": {
                "distance": 200,
                "duration": 0.4
            },
            "push": {
                "particles_nb": 4
            },
            "remove": {
                "particles_nb": 2
            }
        }
    },
    "retina_detect": true
});