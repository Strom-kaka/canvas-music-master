# canvas-music-master
用canvas来看到音乐（可视化）

``` bash

1.渲染模版为 ejs
2.css编译为 less预编译

##
ejs 不用写尖括号 看起来简洁 不过对格式要求很高
less 编译css 写起来很嗨

＃项目思路

1.点击歌曲名称来设置读取音频函数的url
2.通过url来获取歌曲数据，并且判断是否正在播放
3.可以通过音频API来设置声音大小
3.通过音频api来播放歌曲，并在播放的时候用canvas来做动画
4.通过页面按钮来设置canvas动画的类型（圆形还是状图）

###
项目思比较简单，但是实现并不是很容易，音频好多api，用的还是不怎么熟悉

＃＃get start

cd canvas-music-master

npm install

npm start

open browers on localhost:3000

