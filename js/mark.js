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
        this.canvas.width = this.w;
        this.canvas.height = this.h;
        this.ctx.drawImage(this.currentImg,0,0);
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
        newCanvas.setAttribute('width',imgWidth);
        newCanvas.setAttribute('height',imgHeight);
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
     *@synopsis 绑定事件
     */
    bindEvent:function() {
        this.doc.getElementById('wMeasure').onclick = function() {
                mark.canvas.addEventListener('mousemove',function(event) {
                    mark.canvasX = mark.canvas.offsetLeft;
                    mark.canvasY = mark.canvas.offsetTop;
                    if(event.offsetX === undefined) {
                        event.offsetX = event.pageX - mark.canvasX;
                        event.offsetY = event.pageY - mark.canvasY;
                    }
                    var mouseX = event.offsetX,
                        mouseY = event.offsetY;
                        console.log(mark.canvasX);
                });
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
    /**
     *@绘制宽度标尺
     */
    drawAll:function(event) {
        var context = this.ctx;
        context.strokeStyle = '#e74c3c';
        context.lineWidth = 2;
        context.lineCap = 'square';
        context.beginPath();
        context.moveTo(this.canvasX + event.offsetX,this.canvasY + event.offsetY);
        var targetX = event.offsetX > 20 ? 20:event.offsetX;
        context.lineTo(this.canvasX + event.offsetX - targetX,this.canvasY + event.offsetY);
        context.stroke();
        context.closePath();
        this.drawImage();
    },
};
mark.init();

/**
 *@synopsis 窗口改动调整图像位置
 */

window.onresize = function() {
    mark.loadPosition();
}
