
////////////////////////////////////
//
// Tween Nano
//
////////////////////////////////////
var tweenLog = [];

tween = function(_functionType, _element, _time, _object, _ease, _delay){
	if($(_element).css && !_object.notBlock) $(_element).css('display', 'block');
	var easeType = "Power0.easeIn";
	if(_ease) _ease = _ease.toLowerCase();
	switch(_ease){
		case 'sinein': 		easeType = "Sine.easeIn"; break;
		case 'sineout': 	easeType = "Sine.easeOut"; break;
		case 'sineinout': 	easeType = "Sine.easeInOut"; break;
		case 'pow1in': 		easeType = "Power1.easeIn"; break;
		case 'pow1out': 	easeType = "Power1.easeOut"; break;
		case 'pow1inout': 	easeType = "Power1.easeInOut"; break;
		case 'in': 		easeType = "Power2.easeIn"; break;
		case 'out': 	easeType = "Power2.easeOut"; break;
		case 'inout': 	easeType = "Power2.easeInOut"; break;
		case 'pow3in': 		easeType = "Power3.easeIn"; break;
		case 'pow3out': 	easeType = "Power3.easeOut"; break;
		case 'pow3inout': 	easeType = "Power3.easeInOut"; break;
		case 'pow4in': 		easeType = "Power4.easeIn"; break;
		case 'pow4out': 	easeType = "Power4.easeOut"; break;
		case 'pow4inout': 	easeType = "Power4.easeInOut"; break;
		case 'backin': 	easeType = "Back.easeIn"; break;
		case 'backout': easeType = "Back.easeOut"; break;
		case 'bounceout': easeType = "Bounce.easeOut"; break;
		case 'override' : break; // for custom tweens
		case '' : break; // for custom tweens
		default : break;
	}

	if(_ease != 'override') _object.ease = easeType;	

	_object.delay = _delay * timeScale;
	_functionType(_element, _time * timeScale, _object);
	tweenLog.push(_element)
}
var timeScale = 1;
function setTweenTime(n){ timeScale = n }
var set = TweenMax.set;
var from = function(_element, _time, _object, _ease, _delay){tween(TweenMax.from, _element, _time, _object, _ease, _delay)}
var to = function(_element, _time, _object, _ease, _delay){tween(TweenMax.to, _element, _time, _object, _ease, _delay)}
var wait = function(_time, _function, _params){TweenMax.delayedCall(_time * timeScale, _function, _params);tweenLog.push(_function);}
var kill = function(_element){TweenMax.killTweensOf(_element)}
var killAll = function(){
	for(i = 0; i < tweenLog.length; ++i){
		kill(tweenLog[i]);
	}
	tweenLog = [];
}

function trace(str){console.log(str)}

// FAUX RANDOM
var randomSeed = 0;
function setRandomSeed(n){ randomSeed = n; }
var randomArray = [0.903,0.564,0.017,0.729,0.95,0.1,0.524,0.204,0.26,0.092,0.719,0.34,0.876,0.723,0.446,0.439,0.858,0.347,0.047,0.399,0.861,0.659,0.804,0.55,0.133,0.715,0.354,0.459,0.975,0.547,0.85,0.843,0.526,0.401,0.643,0.358,0.392,0.946,0.905,0.456,0.713,0.734,0.376,0.489,0.391,0.418,0.511,0.67,0.049,0.133,0.395,0.866,0.49,0.33,0.315,0.303,0.549,0.852,0.995,0.834,0.392,0.179,0.914,0.804,0.911,0.53,0.1,0.234,0.961,0.778,0.161,0.94,0.622,0.728,0.474,0.101,0.601,0.718,0.2,0.77,0.139,0.423,0.847,0.105,0.994,0.784,0.147,0.225,0.179,0.229,0.863,0.476,0.749,0.209,0.044,0.12,0.635,0.728,0.574,0.637,0.246,0.455,0.112,0.504,0.963,0.093,0.138,0.76,0.634,0.183,0.777,0.793,0.325,0.831,0.288,0.407,0.122,0.289,0.572,0.433,0.48,0.418,0.788,0.838,0.285,0.91,0.581,0.533,0.498,0.923,0.495,0.81,0.787,0.51,0.584,0.355,0.139,0.803,0.152,0.833,0.959,0.719,0.14,0.895,0.055,0.948,0.503,0.072,0.243,0.937,0.277,0.073,0.026,0.811,0.873,0.468,0.18,0.959,0.023,0.949,0.881,0.689,0.404,0.584,0.634,0.133,0.301,0.38,0.093,0.877,0.535,0.682,0.275,0.499,0.983,0.749,0.831,0.325,0.629,0.479,0.477,0.366,0.091,0.749,0.523,0.602,0.491,0.781,0.019,0.629,0.705,0.688,0.282,0.805,0.29,0.323,0.425,0.563,0.101,0.597,0.35,0.258,0.48,0.581,0.782,0.146,0.51,0.932,0.379,0.532,0.437,0.008,0.561,0.366,0.703,0.937,0.502,0.787,0.539,0.61,0.955,0.577,0.776,0.231,0.284,0.34,0.59,0.159,0.825,0.188,0.342,0.889,0.115,0.44,0.534,0.731,0.311,0.709,0.258,0.621,0.243,0.769,0.438,0.738,0.859,0.49,0.982,0.754,0.192,0.479,0.329,0.319,0.847,0.926,0.336,0.06,0.402,0.625,0.526,0.029,0.142,0.853,0.128,0.724,0.704,0.814,0.429,0.588,0.168,0.881,0.404,0.558,0.72,0.334,0.406,0.793,0.032,0.569,0.703,0.263,0.983,0.856,0.628,0.861,0.098,0.724,0.389,0.011,0.905,0.317,0.9,0.349,0.978,0.411,0.256,0.566,0.438,0.154,0.866,0.713,0.502,0.109,0.152,0.206,0.811,0.988,0.545,0.774,0.501,0.39,0.741,0.534,0.778,0.87,0.394,0.958,0.342];
function random(n,floor){
	if(!n) n = 1;
	if(randomSeed < randomArray.length - 1){
		randomSeed++
	} else {
		randomSeed = 0;
	}
	if(floor){
		return Math.floor(randomArray[randomSeed] * n);
	} else {
		return randomArray[randomSeed] * n;
	}
}

// function stopDrag(){
// 	for(i = 0; i < draggableObjects.length; ++i){
// 		$(draggableObjects[i]).unbind();
// 	}
// }

function mod(n1,n2){
	return(n1 % n2)
}

// MOBILE CHECK for touch device.
window.isTouchDevice = function() {
  return 'ontouchstart' in window;
}