export default {
    "particles": {
        "number": {
            "value": 200,
            "density": {
                "enable": false,
                "value_area": 2000
            }
        },
        "color": { "value": "#ffffff" },
        "shape": {
            "type": "circle",
            "stroke": {
                "color": "#000000",
                "width": 0
            },
            "polygon": { "sides": 5 },
            "image": {
                "height": 100,
                "replaceColor": true,
                "src": "images/github.svg",
                "width": 100
            },
            "character": {
                "fill": false,
                "font": "Verdana",
                "style": "",
                "value": "*",
                "weight": "400"
            },
        },
        "opacity": {
            "value": 0.4,
            "random": false,
            "animation": {
                "enable": true,
                "minimumValue": 0.05,
                "speed": 2,
                "sync": false
            },
        },
        "size": {
            "value": 3,
            "random": true,
            "animation": {
                "enable": false,
                "size_min": 0.1,
                "speed": 40,
                "sync": false
            },
        },
        "lineLinked": {
            "blink": false,
            "color": "#ffffff",
            "consent": false,
            "distance": 30,
            "enable": true,
            "opacity": 0.4,
            "width": 1
        },
        "move": {
            "attract": {
                "enable": false,
                "rotate": {
                    "x": 600,
                    "y": 1200
                }
            },
            "bounce": false,
            "direction": "none",
            "enable": true,
            "outMode": "bounce",
            "random": false,
            "speed": 1,
            "straight": false
        },
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onClick": {
                "enable": false,
                "mode": "push"
            },
            "onDiv": {
                "elementId": "repulse-div",
                "enable": false,
                "mode": "repulse"
            },
            "onHover": {
                "enable": true,
                "mode": "bubble",
                "parallax": {
                    "enable": false,
                    "force": 2,
                    "smooth": 10
                }
            },
            "resize": true
        },
        "modes": {
            "bubble": {
                "distance": 40,
                "duration": 2,
                "opacity": 8,
                "size": 6,
                "speed": 3
            },
            "connect": {
                "distance": 80,
                "lineLinked": { "opacity": 0.5 },
                "radius": 60
            },
            'grab': {
                "distance": 400,
                "lineLinked": { 'opacity': 1 }
            },
            "push": { "quantity": 4 },
            "remove": { "quantity": 2 },
            "repulse": {
                "distance": 200,
                "duration": 0.4
            },
            "slow": {
                "active": false,
                "radius": 0,
                "factor": 1
            }
        }
    },
    "polygon": {
        "enable": true,
        "scale": 0.5,
        "type": "inline",
        "move": {
            "radius": 0
        },
        "url": require("./smalldeer.svg"),
        "inline": {
            "arrangement": "equidistant"
        },
        "draw": {
            "enable": true,
            "stroke": {
                "color": "rgba(255, 255, 255, .2)"
            }
        }
    },
    "detectRetina": false,
    "fpsLimit": 60,
}