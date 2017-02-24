

function musizcVisualizer(obj){
	this.source = null;
	this.count = 0;
	this.analyser = musizcVisualizer.ac.createAnalyser();
	this.size = obj.size;
	this.analyser.fftSize = this.size*2;
	this.GainNode = musizcVisualizer.ac[musizcVisualizer.ac.createGain?"createGain":"createGainNode"]();
	this.GainNode.connect(musizcVisualizer.ac.destination);
	this.analyser.connect(this.GainNode);
	this.xhr = new XMLHttpRequest();
	this.visualizer = obj.visualizer;
	this.visualize()
}
musizcVisualizer.ac = new (window.AudioContext || window.webkitAudioContext)();//创建音频环境

musizcVisualizer.prototype.load = function(url,fun){
	this.xhr.abort();
	this.xhr.open('GET',url);
	this.xhr.responseType = 'arraybuffer';
	var self = this;
	this.xhr.onload = function(){
		fun(self.xhr.response);
	}
	this.xhr.send();
}
musizcVisualizer.prototype.decode = function(arraybuffer,fun){
	musizcVisualizer.ac.decodeAudioData(arraybuffer,function(buffer){
		fun(buffer);
	},function(err){
		console.log(err);
	})
}
musizcVisualizer.prototype.play = function(url){
	var n = ++ this.count;
	var self = this;
	this.source && this.stop();
	this.load(url,function(arraybuffer){
		if(n != self.count) return;
		self.decode(arraybuffer,function(buffer){
			if(n != self.count) return;
			var bs = musizcVisualizer.ac.createBufferSource();
			bs.connect(self.analyser)
			bs.buffer = buffer;
			bs[bs.start?"start":"noteOn"](0);
			self.source = bs;
		});
	})
}
musizcVisualizer.prototype.stop = function (){
	this.source[this.source.stop?"stop":"noteOff"](0);
}

musizcVisualizer.prototype.changeVolume = function(percent){
	this.GainNode.gain.value = percent*percent;
}

musizcVisualizer.prototype.visualize = function(){
	var arr = new Uint8Array(this.analyser.frequencyBinCount);
	
	requestAnimationFrame = window.requestAnimationFrame ||
							window.webkitRequestAnimationFrame ||
							window.mozRequestAnimationFrame ;
	var self = this;						
	function v(){
		self.analyser.getByteFrequencyData(arr);
		self.visualizer(arr)
		requestAnimationFrame(v);
	}
	requestAnimationFrame(v);	
}







