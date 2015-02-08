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
        this.canvas.width = this.w + 10;
        this.canvas.height = this.h +10;
        this.ctx.drawImage(this.currentImg,5,5,this.w,this.h);
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
        newCanvas.setAttribute('width',imgWidth+10);
        newCanvas.setAttribute('height',imgHeight+10);
        this.w = imgWidth;
        this.h = imgHeight;
        img.remove();
        //img.style.display = 'none';
        this.doc.body.appendChild(newCanvas);
        this.canvas = this.doc.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.currentImg.onload = function() {
            mark.drawImage();
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

mark.active = {
    ctx:null,
    canvas:null,
    canvasX:null,
    canvasY:null,
    ny:null,
    /*当前鼠标的坐标*/
    currentMP:null,
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
        if(mark.iswMeasure) {
            this.drawWidthRuler();
        }
        if(mark.ishMeasure) {
            this.drawHeightRuler();
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
        context.moveTo(this.currentMP.x - 5,this.currentMP.y);
        var targetX = this.currentMP.x > 20 ? 20:this.currentMP.x;
        context.lineTo(this.currentMP.x - targetX -5,this.currentMP.y);
        //绘制左边基准线
        context.moveTo(this.currentMP.x - targetX - 6,this.currentMP.y - 5);
        context.lineTo(this.currentMP.x - targetX - 6,this.currentMP.y + 5);
        //绘制右边基准线
        context.moveTo(this.currentMP.x - 4,this.currentMP.y - 5);
        context.lineTo(this.currentMP.x - 4,this.currentMP.y + 5);
        //绘制数字
        context.font = '10px Arial';
        context.fillText('20',this.currentMP.x - 20,this.currentMP.y + 5);
        context.stroke();
        context.closePath();
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
        context.moveTo(this.currentMP.x,this.currentMP.y -5);
        var targetY = this.currentMP.y > 20 ? 20:this.currentMP.y;
        context.lineTo(this.currentMP.x,this.currentMP.y - targetY - 5);
        //绘制顶部基准线
        context.moveTo(this.currentMP.x - 5,this.currentMP.y - targetY - 6);
        context.lineTo(this.currentMP.x + 5,this.currentMP.y - targetY - 6);
        //绘制底边基准线
        context.moveTo(this.currentMP.x - 5,this.currentMP.y - 4);
        context.lineTo(this.currentMP.x + 5,this.currentMP.y - 4);
        //绘制数字
        context.font = '10px Arial';
        context.fillText('20',this.currentMP.x,this.currentMP.y - 10);
        context.stroke();
        context.closePath();
    },
    /**
     *@synopsis canvas层的事件绑定
     */
    bindEvent:function() {
        this.canvas.addEventListener('mousemove',function(event) {
                var active = mark.active;
                console.log(mark.isClicked);
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
                console.log(active.currentMP);
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
