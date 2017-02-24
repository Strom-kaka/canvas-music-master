function $(s){
	return document.querySelectorAll(s);
}

var lis = $('#list li');

for(var i=0;i<lis.length;i++){
	lis[i].onclick = function(){
		for(var j=0;j<lis.length;j++){
			lis[j].className = '';
		}
		this.className = 'selected';
		load("/media/" + this.title)
	}
}

var xhr = new XMLHttpRequest();//创建请求
var ac = new (window.AudioContext || window.webkitAudioContext)();//创建音频环境
var gainNode = ac[ac.createGain?"createGain":"createGainNode"]();//创建管理音量大小对象

gainNode.connect(ac.destination);//连接到音频集点
var analyser = ac.createAnalyser();//创建分析音频对象
var size = 128;

analyser.fftSize = size *2;
analyser.connect(gainNode);

var source = null;
var count = 0;
//获取box
var box = $('#box')[0]; 
var width,height;
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
box.appendChild(canvas);

var Dots = [];//新建圆点数组


//获取随机数
function random(m,n){
	return Math.round(Math.random()*(n-m)+m)
	
}

function getDots(){
	Dots = [];//清空
	for(var i=0;i<size;i++){
		var x = random(0,width)
		var y = random(0,height);
		var color = "rgb(" +random(0,255)+","+random(0,255)+","+random(0,255)+")";
		Dots.push({
			x:x,
			y:y,
			color:color
		})
	}
}
var line;//线性渐变

function resize(){
	height = box.clientHeight;
	width = box.clientWidth;
	canvas.height = height;
	canvas.width = width;
	line = ctx.createLinearGradient(0,0,0,height);
	line.addColorStop(0,'red');
	line.addColorStop(0.5,'yellow');
	line.addColorStop(1,'green');
	getDots();
}
resize();
window.onresize = resize; //窗口大小改变时，修改canvas大小

function draw(arr){
	ctx.clearRect(0,0,width,height)
	var w = width/size;
	ctx.fillStyle = line;
	for(var i=0;i<size;i++){
		if(draw.type == "column"){
			var h = arr[i]/256*height;
			ctx.fillRect(w*i,height - h,w*0.6,h);
		}else if(draw.type == 'dot'){
			ctx.beginPath();
			var o = Dots[i];
			var radius = arr[i]/256 *50;
			ctx.arc(o.x,o.y,radius,0,Math.PI*2,true);
			var g = ctx.createRadialGradient(o.x,o.y,0,o.x,o.y,radius);//创建径向渐变
			g.addColorStop(0,'#fff');
			g.addColorStop(1,o.color);
			
			ctx.fillStyle = g,
			ctx.fill();
			//ctx.strokeStyle = '#fff';
			//ctx.stroke();
		}
	}
}
draw.type = "column";//默认为柱状图
//切换类型
var type = $('#type li');
for(var i=0;i<type.length;i++){
	type[i].onclick = function(){
		for(var j=0;j<type.length;j++){
			type[j].className = '';
		}
		this.className = 'selected';
		draw.type = this.getAttribute('data-type');
	}
}


//获取音频数据
function load(url){
	var n = ++count;
	source && source[source.stop? "stop" : "boteOff"]();//如果歌曲正在播放则停止
	xhr.abort();//终止上一次的请求
	xhr.open('GET',url);
	xhr.responseType = 'arraybuffer';
	xhr.onload = function(){
		//console.log(xhr.response);
		if(n != count) return;
		ac.decodeAudioData(xhr.response,function(buffer){
			if(n != count) return;
			var bufferSource = ac.createBufferSource();//创建对象
			bufferSource.buffer = buffer;//赋值
			bufferSource.connect(analyser);//音频连接分析节点
			bufferSource[bufferSource.start?"start":"noteOn"](0);//立即播放
			source = bufferSource; //储存歌曲
		},function(err){
			console.log(err)
		})
	}
	xhr.send();
}

//改变管理音频声音大小
function changeVolume(percent){
	gainNode.gain.value = percent * percent
}
$('#volume')[0].onchange = function(){
	changeVolume(this.value/this.max)
}

$('#volume')[0].onchange();
//分析音频
function visualizer(){
	var arr = new Uint8Array(analyser.frequencyBinCount);
	//analyser.getByteFrequencyData(arr);
	//console.log(arr)
	
	requestAnimationFrame = window.requestAnimationFrame ||
							window.webkitRequestAnimationFrame ||
							window.mozRequestAnimationFrame ;
	function v(){
		analyser.getByteFrequencyData(arr);
		
		draw(arr);//绘制数组
		
		requestAnimationFrame(v);
		//console.log(arr);
	}
	requestAnimationFrame(v);
}

visualizer();
























