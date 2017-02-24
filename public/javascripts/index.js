function $(s){
	return document.querySelectorAll(s);
}

var lis = $('#list li');
var size =128;

//获取box
var box = $('#box')[0]; 
var width,height;
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
box.appendChild(canvas);

var Dots = [];//新建圆点数组
var speed = [];
var line;//线性渐变

var mv = new musizcVisualizer({
	size:size,
	visualizer:draw
})

for(var i=0;i<lis.length;i++){
	lis[i].onclick = function(){
		for(var j=0;j<lis.length;j++){
			lis[j].className = '';
		}
		this.className = 'selected';
		//load("/media/" + this.title)
		mv.play("/media/" + this.title)
	}
}


//获取随机数
function random(m,n){
	return Math.round(Math.random()*(n-m)+m)
	
}

function getDots(){
	Dots = [];//清空
	for(var i=0;i<size;i++){
		var x = random(0,width)
		var y = random(0,height);
		var color = "rgba(" +random(0,255)+","+random(0,255)+","+random(0,255)+",0.4)";
		Dots.push({
			x:x,
			y:y,
			dx:random(1,4),
			color:color,
			cap:0
		})
	}
}

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
	var cw = w*0.6;
	var capH = cw >6? 6:cw;
	ctx.fillStyle = line;
	for(var i=0;i<size;i++){
			var o = Dots[i];
		if(draw.type == "column"){
			var h = arr[i]/256*height;
			ctx.fillRect(w*i,height - h,cw,h);
			ctx.fillRect(w*i,height - (o.cap +capH),cw,capH);
			o.cap --;
			if(o.cap<0){
				o.cap = 0;
			}
			if(h>0 &&o.cap <h +40){
				o.cap = h+40 > height- capH? height-capH :h +40;
			}
		}else if(draw.type == 'dot'){
			ctx.beginPath();
			var radius =4+ arr[i]/256 *(height >width? width:height)/20;
			ctx.arc(o.x,o.y,radius,0,Math.PI*2,true);
			var g = ctx.createRadialGradient(o.x,o.y,0,o.x,o.y,radius);//创建径向渐变
			g.addColorStop(0,'#fff');
			g.addColorStop(1,o.color);
			
			ctx.fillStyle = g,
			ctx.fill();
			
			speed.push(o.dx)
			o.x +=(o.dx)/4;
			o.x = o.x>width? 0:o.x;
			
			
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
$('#volume')[0].onchange = function(){
	mv.changeVolume(this.value/this.max)
}
$('#volume')[0].onchange();

var dotMode = 'dot';
canvas.onclick = function(){
	
	if(draw.type == 'dot'){
		for(var i=0;i<size;i++){
			dotMode =='dot'?Dots[i].dx =0 : Dots[i].dx = speed[i];
		}
		dotMode = dotMode =='dot'?'culm':'dot';
	}
}
























