/*
 *chrome测量、标注图片插件
 *
 *@author:waterbear
 */
'use strict';
console.log("匹配成功\n");
console.log(window.location.href);
/**
 *mark对象
 */
var mark = {
    doc:null,
    canvas:null,
    ctx:null,
    /*当前图片对象*/
    currentImg:null,
    /*图片宽*/
    w:null,
    /*图片高*/
    h:null,
    /*是否点击按钮*/
    isClicked:false,
    /**
     *@synopsis 创建button按钮
     *@param bId 按钮的id
     *@param bClass按钮的class
     *@param bContent 按钮里面的内容
     *@returns 返回创建好的按钮
     */

    createButton:function(bId,bClass,bContent) {
        var button = this.doc.createElement("button");
        button.type = "button";
        button.setAttribute("id",bId);
        button.setAttribute("class",bClass);
        button.innerHTML = bContent;
        return button;
    },
    /**
     *@synopsis 绘制图片
     *
     */
    drawImage:function() {
        this.canvas.width = this.w + 20;
        this.canvas.height = this.h + 20;
        this.ctx.drawImage(this.currentImg,10,10,this.w,this.h);
        if(this.isClicked) {
            this.active.drawAll();
        }
    },
    /**
     *@synopsis 下载图片
     */
    downLoadImg:function() {
        var dataURL = this.canvas.toDataURL('image/jpeg');
        dataURL = dataURL.replace("image/jpeg", "image/octet-stream");
        window.location.href = dataURL;
    },
    /**
     *@synopsis 向DOM中插入Canvas,同时在canvas中绘制刚刚加载的图片
     */
    insertCanvas:function() {
        var newCanvas = this.doc.createElement('canvas'),
            img = this.doc.getElementsByTagName('img')[0],
            imgWidth,
            imgHeight;
        newCanvas.setAttribute('id','canvas');
        imgWidth = img.offsetWidth;
        imgHeight = img.offsetHeight;
        newCanvas.setAttribute('width',imgWidth+20);
        newCanvas.setAttribute('height',imgHeight+20);
        this.w = imgWidth;
        this.h = imgHeight;
        img.remove();
        //img.style.display = 'none';
        this.doc.body.appendChild(newCanvas);
        this.canvas = this.doc.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        //var reader = new FileReader();
        //reader.readAsDataURL(img.src);
        //reader.onload = function(e) {
        //    var urlData = e.target.result;
        //    mark.currentImg.src = urlData;
        //    mark.currentImg.onload = function() {
        //        mark.drawImage();
        //        mark.w = this.width;
        //        mark.h = this.height;
        //        mark.active.imageData = mark.ctx.getImageData(0,0,mark.canvas.width,mark.canvas.height).data;
        //    }
        //}
        this.currentImg.onload = function() {
            mark.drawImage();
            mark.w = this.width;
            mark.h = this.height;
            mark.active.imageData = mark.ctx.getImageData(0,0,mark.canvas.width,mark.canvas.height).data;
        }
        this.currentImg.src = img.src;
        mark.active.init();
    },

    /**
     *@synopsis 元素定位
     */
    loadPosition:function() {
        var main = this.doc.getElementById('main');
        main.style.marginLeft = -(main.offsetWidth / 2) + 'px';
        var canvas = this.canvas,
            bWidth = this.doc.body.clientWidth,
            canvasWidth;
        canvasWidth = canvas.offsetWidth;
        if(bWidth > canvasWidth) {
            canvas.style.marginLeft = (bWidth - canvasWidth) / 2;
        }
    },

    /**
     *@synopsis 向页面中插入底部控制面板
     */
    insertPanel:function() {
        var mainDiv = this.doc.createElement("div");
        mainDiv.setAttribute("id","main");
        mainDiv.setAttribute("class","main");
        mainDiv.appendChild(this.createButton('wMeasure','btn btn-primary','测量宽度'));
        mainDiv.appendChild(this.createButton('hMeasure','btn btn-success','测量高度'));
        mainDiv.appendChild(this.createButton('getColor','btn btn-info','取色'));
        mainDiv.appendChild(this.createButton('Mouse','btn btn-warning','指针移动'));
        mainDiv.appendChild(this.createButton('save','btn btn-danger','保存'));
        this.doc.getElementsByTagName("body")[0].appendChild(mainDiv);
        this.loadPosition();
    },


    /*
     *@synopsis 按钮的事件绑定
     */
    bindEvent:function() {
        this.doc.getElementById('main').onclick = function() {
            mark.isClicked = true;
        };
        this.doc.getElementById('wMeasure').onclick = function() {
            mark.iswMeasure = true;
            mark.ishMeasure = false;
            mark.isGetColor = false;
        };
        this.doc.getElementById('hMeasure').onclick = function() {
            mark.ishMeasure = true;
            mark.iswMeasure = false;
            mark.isGetColor = false;
        };
        this.doc.getElementById('getColor').onclick = function() {
            mark.isGetColor = true;
            mark.iswMeasure = false;
            mark.ishMeasure = false;
        }
        this.doc.getElementById('Mouse').onclick = function(e) {
            mark.isClicked = false;
            mark.drawImage();
            e.stopPropagation(e);
        }
        this.doc.getElementById('save').onclick = function() {
            mark.isClicked = false;
            mark.downLoadImg();
        }
    },

    /**
     *@synopsis 初始化
     */
    init:function() {
        this.doc = document;
        this.currentImg = new Image();
        this.insertCanvas();
        this.insertPanel();
        this.bindEvent();
    }


};
/**
 *@synopsis 添加绘制虚线的方法
 *@param startX  起始横坐标
 *@param startY  起始纵坐标
 *@param endX 　 结束横坐标
 *@param endY    结束纵坐标
 *@param pattern 最小虚线长度
 */
CanvasRenderingContext2D.prototype.dashedLineTo = function(startX,startY,endX,endY,pattern) {
    if(typeof pattern === undefined) {
        pattern = 5;
    }
    var dx = (endX - startX),
        dy = (endY - startY),
        distance = Math.floor(Math.sqrt(dx * dx + dy * dy)),
        dashlineInteveral = (pattern <= 0) ?distance:(distance / pattern),
        deltay = (dy / distance) * pattern,
        deltax = (dx / distance) * pattern;
    this.beginPath();
    for(var dl = 0; dl < dashlineInteveral; dl++) {
        if(dl%2) {
            this.lineTo(startX + dl*deltax,endY + dl*deltay);
        }
        else{
            this.moveTo(startX + dl*deltax,endY + dl*deltay);
        }
    }
    this.stroke();
};
mark.active = {
    ctx:null,
    canvas:null,
    canvasX:null,
    canvasY:null,
    imageData:null,
    /*在canvas上是否按下鼠标*/
    isMouseDown:null,
    /*当前鼠标的坐标*/
    currentMP:null,
    /*鼠标按下时的坐标*/
    mousedownMP:null,
    /*鼠标释放时的坐标*/
    mouseupMP:null,
    /*所有已测量的宽度数据*/
    measuredWidth:[],
    /*所有已测量的高度数据*/
    measuredHeight:[],
    /*所有已测量的颜色数据*/
    measuredColor:[],
    /**
     *@synopsis 绘制所有样式
     */
    drawAll:function() {
        if(this.measuredWidth.length > 0) {
            for(var i in this.measuredWidth) {
                this.drawWidth(this.measuredWidth[i]);
            }
        }
        if(this.measuredHeight.length > 0) {
            for(var i in this.measuredHeight) {
                this.drawHeight(this.measuredHeight[i]);
            }
        }
        if(this.measuredColor.length > 0) {
            for(var i in this.measuredColor) {
                this.drawPicker(this.measuredColor[i]);
            }
        }
        if(mark.iswMeasure) {
            if(this.isMouseDown) {
                console.log(this.isMouseDown);
                var point = {},
                    targetX;
                targetX = this.mousedownMP.x > 20 ? 20:this.mousedownMP.x;
                point.startX = this.mousedownMP.x - 10 - targetX;
                point.startY = this.mousedownMP.y - 5;
                point.endX = this.currentMP.x - 10;
                point.endY = this.currentMP.y - 5;
                this.drawWidth(point);
                return;
            }
            this.drawWidthRuler();
        }
        if(mark.ishMeasure) {
            if(this.isMouseDown) {
                var point = {},
                    targetY;
                targetY = this.mousedownMP.y > 20 ? 20:this.mousedownMP.y;
                point.startX = this.mousedownMP.x - 10;
                point.startY = this.mousedownMP.y - 10 -targetY;
                point.endX = this.currentMP.x - 10;
                point.endY = this.currentMP.y - 10;
                this.drawHeight(point);
                return;
            }
            this.drawHeightRuler();
        }
        if(mark.isGetColor) {
            this.drawPicker(this.currentMP);
        }
    },
    /**
     *@synopsis 绘制宽度标尺
     */
    drawWidthRuler:function() {
        var context = this.ctx;
        context.strokeStyle = 'red';
        context.lineWidth = 1;
       // context.lineCap = 'square';
        context.beginPath();
        //画宽度线
        context.moveTo(this.currentMP.x - 10,this.currentMP.y - 5);
        var targetX = this.currentMP.x > 20 ? 20:this.currentMP.x;
        context.lineTo(this.currentMP.x - targetX -10,this.currentMP.y - 5);
        //绘制左边基准线
        context.moveTo(this.currentMP.x - targetX - 11,this.currentMP.y - 10);
        context.lineTo(this.currentMP.x - targetX - 11,this.currentMP.y);
        //绘制右边基准线
        context.moveTo(this.currentMP.x - 9,this.currentMP.y - 10);
        context.lineTo(this.currentMP.x - 9,this.currentMP.y);
        //绘制数字
        context.font = '10px Arial';
        context.fillText('20',this.currentMP.x - 25,this.currentMP.y - 5);
        context.stroke();
        context.closePath();
        //绘制锚点
        context.strokeStyle = 'red';
        context.strokeRect(this.currentMP.x - 2,this.currentMP.y - 7,5,5);
    },

    /**
     *@synopsis 绘制高度标尺
     */
    drawHeightRuler:function() {
        var context = this.ctx;
        context.strokeStyle = 'red';
        context.lineWidth = 1;
        //context.lineCap = 'square';
        context.beginPath();
        context.moveTo(this.currentMP.x - 10,this.currentMP.y - 10);
        var targetY = this.currentMP.y > 20 ? 20:this.currentMP.y;
        context.lineTo(this.currentMP.x - 10,this.currentMP.y - targetY - 10);
        //绘制顶部基准线
        context.moveTo(this.currentMP.x - 15,this.currentMP.y - targetY - 11);
        context.lineTo(this.currentMP.x - 5,this.currentMP.y - targetY - 11);
        //绘制底边基准线
        context.moveTo(this.currentMP.x - 15,this.currentMP.y - 9);
        context.lineTo(this.currentMP.x - 5,this.currentMP.y - 9);
        //绘制数字
        context.font = '10px Arial';
        context.fillText('20',this.currentMP.x - 10,this.currentMP.y - 15);
        context.stroke();
        context.closePath();
        //绘制锚点
        context.strokeStyle = 'red';
        context.strokeRect(this.currentMP.x - 12,this.currentMP.y,5,5)
    },

    /**
     *@synopsis 绘制取色器
     */
    drawPicker:function(point) {
        var context = this.ctx,
            color = this.pickColor(point);
        /*绘制鼠标点*/
        context.strokeStyle = 'red';
        context.strokeRect(point.x - 4,point.y - 4,4,4);
        /*绘制颜色值*/
        context.beginPath();
        context.strokeStyle = 'red';
        context.lineWidth = 1;
        context.moveTo(point.x + 10,point.y - 2);
        context.lineTo(point.x,point.y - 2);
        context.stroke();
        context.closePath();
        /*绘制颜色框*/
        context.fillStyle = '#' + color.rgbHex;
        context.fillRect(point.x + 10,point.y - 6,12,12);
        context.strokeStyle = 'red';
        context.strokeRect(point.x + 10,point.y -6,12,12);
        /*绘制进制值*/
        context.font = '10px Arial';
        context.fillStyle = 'red';
        context.fillText('#'+color.rgbHex,point.x + 24,point.y);
    },

    /**
     *@synopsis 获取颜色
     */
    pickColor:function(point) {
        var canvasIndex = (point.x + point.y * this.canvas.width) * 4,
            active = mark.active,
            color = {
                r:active.imageData[canvasIndex],
                g:active.imageData[canvasIndex+1],
                b:active.imageData[canvasIndex+2],
                alpha:active.imageData[canvasIndex+3]
            };
        color.rgbHex = active.rgbToHex(color.r,color.g,color.b);
        color.opposite = active.rgbToHex(255 - color.r,255 - color.g,255 - color.b)
        return color;
    },

    /**
     *@synopsis 将颜色值转换成16进制
     */
    rgbToHex:function(r,g,b) {
        return this.toHex(r) + this.toHex(g) + this.toHex(b);
    },
    toHex:function(i) {
        if(i === undefined) {
            return 'FF';
        }
        var str = i.toString(16);
        while(str.length < 2) {
            str = '0' + str;
        }
        return str;
    },

    /**
     *@synopsis　绘制宽度
     *@param point 坐标对象包含起始坐标和结束坐标
     */
    drawWidth:function(point) {
        var context = this.ctx,
            width = point.endX - point.startX,
            strWidth = Math.abs(width).toString();
        context.strokeStyle = 'red';
        context.lineWidth = 1;
        //context.lineCap = 'square';
        context.beginPath();
        //绘制宽度
        context.moveTo(point.startX,point.startY);
        context.lineTo(point.endX,point.startY);
        //绘制左边基准线
        context.moveTo(point.startX - 1,point.startY - 5);
        context.lineTo(point.startX - 1,point.startY + 5);
        //绘制右边基准线
        context.moveTo(point.endX + 1,point.startY - 5);
        context.lineTo(point.endX + 1,point.startY + 5);
        //绘制数字
        context.font = '10px Arial';
        context.fillText(strWidth,point.startX + width / 2,point.startY);
        context.stroke();
        context.closePath();
        //绘制锚点
        context.strokeStyle = 'red';
        context.strokeRect(point.endX + 8,point.startY - 2,5,5)
    },

    /**
     *@synopsis 绘制高度
     *@param point 坐标对象包含起始坐标和结束坐标
     */
    drawHeight:function(point) {
        var context = this.ctx,
            height = point.endY - point.startY,
            strHeight = Math.abs(height).toString();
        context.strokeStyle = 'red';
        context.lineWidth = 1;
        //context.lineCap = 'square';
        context.beginPath();
        //绘制高度线
        context.moveTo(point.startX,point.startY);
        context.lineTo(point.startX,point.endY);
        //绘制顶部基准线
        context.moveTo(point.startX - 5,point.startY - 1);
        context.lineTo(point.startX + 5,point.startY - 1);
        //绘制底边基准线
        context.moveTo(point.startX - 5,point.endY + 1);
        context.lineTo(point.startX + 5,point.endY + 1);
        //绘制数字
        context.font = '10px Arial';
        context.fillText(strHeight,point.startX,point.startY + height/2);
        context.stroke();
        context.closePath();
        //绘制锚点
        context.strokeStyle = 'red';
        context.strokeRect(point.startX - 2,point.endY + 10,5,5)
    },

    /**
     *@synopsis 绘制颜色
     *@param point 坐标对象包含取色点的坐标和色值
     */
    drawColor:function() {

    },
    /**
     *@synopsis canvas层的事件绑定
     */
    bindEvent:function() {
        this.canvas.addEventListener('mousemove',function(event) {
                var active = mark.active;
                if(!mark.isClicked) {
                    return;
                }
                active.canvasX = active.canvas.offsetLeft;
                active.canvasY = active.canvas.offsetTop;
                if(event.offsetX === undefined) {
                    event.offsetX = event.pageX - active.canvasX;
                    event.offsetY = event.pageY - active.canvasY;
                }
                var mouseX = event.offsetX,
                    mouseY = event.offsetY;
                active.currentMP.x = mouseX;
                active.currentMP.y = mouseY;
                mark.drawImage();
        });
        this.canvas.addEventListener('mousedown',function(event) {
            var active = mark.active;
            if(!mark.isClicked) {
                return;
            }
            active.isMouseDown = true;
            active.canvasX = active.canvas.offsetLeft;
            active.canvasY = active.canvas.offsetTop;
            if(event.offsetX === undefined) {
                event.offsetX = event.pageX - active.canvasX;
                event.offsetY = event.pageY - active.canvasY;
            }
            var mouseX = event.offsetX,
                mouseY = event.offsetY;
            if(mark.iswMeasure || mark.ishMeasure) {
                active.mousedownMP.x = mouseX;
                active.mousedownMP.y = mouseY;
            }
            if(mark.isGetColor) {
                active.measuredColor.push({
                    x:mouseX - 1,
                    y:mouseY - 1
                });
            }
        });
        this.canvas.addEventListener('mouseup',function() {
            var active = mark.active;
            if(!mark.isClicked) {
                return;
            }
            active.isMouseDown = false;
            active.canvasX = active.canvas.offsetLeft;
            active.canvasY = active.canvas.offsetTop;
            if(event.offsetX === undefined) {
                event.offsetX = event.pageX - active.canvasX;
                event.offsetY = event.pageY - active.canvasY;
            }
            var mouseX = event.offsetX,
                mouseY = event.offsetY;
            active.mouseupMP.x = mouseX;
            active.mouseupMP.y = mouseY;
            var targetX,targetY,
                fromX,fromY,
                toX,toY;
            if(mark.iswMeasure) {
                targetX = active.mousedownMP.x > 20 ? 20:active.mousedownMP.x;
                fromX = active.mousedownMP.x - 10 - targetX;
                fromY = active.mousedownMP.y - 5;
                toX = active.mouseupMP.x - 10;
                toY = active.mouseupMP.y - 5;
                active.measuredWidth.push({
                    startX:fromX,
                    startY:fromY,
                    endX:toX,
                    endY:toY
                });
            }
            if(mark.ishMeasure) {
                targetY = active.mousedownMP.y > 20 ? 20:active.mousedownMP.y;
                fromX = active.mousedownMP.x - 10;
                fromY = active.mousedownMP.y - 10 - targetY;
                toX = active.mouseupMP.x - 10;
                toY = active.mouseupMP.y - 10;
                active.measuredHeight.push({
                    startX:fromX,
                    startY:fromY,
                    endX:toX,
                    endY:toY
                });
            }
            mark.drawImage();
        });
    },

    /**
     *@synopsis 初始化函数
     */
    init:function() {
        this.ctx = mark.ctx;
        this.canvas = mark.canvas;
        this.currentMP = {x:null,y:null};
        this.mousedownMP = {x:null,y:null};
        this.mouseupMP = {x:null,y:null};
        this.bindEvent();
    }
};
mark.init();

/**
 *@synopsis 窗口改动调整图像位置
 */

window.onresize = function() {
    mark.loadPosition();
}
