/*
 *chrome测量、标注图片插件
 *
 *@author:waterbear
 */
'use strict';
console.log("匹配成功\n");
console.log(window.location.href);
var doc = document;
/**
 *@synopsis 创建button按钮
 *@param bId 按钮的id
 *@param bClass按钮的class
 *@param bContent 按钮里面的内容
 *@returns 返回创建好的按钮
 */

var createButton = function(bId,bClass,bContent) {
    var button = doc.createElement("button");
    button.type = "button";
    button.setAttribute("id",bId);
    button.setAttribute("class",bClass);
    button.innerHTML = bContent;
    return button;
}

/**
 *@synopsis 向DOM中插入Canvas,同时在canvas中绘制刚刚加载的图片
 */
var insertCanvas = function() {
    var newCanvas = doc.createElement('canvas'),
        img = doc.getElementsByTagName('img')[0],
        imgWidth,
        imgHeight;
    newCanvas.setAttribute('id','canvas');
    imgWidth = img.offsetWidth;
    imgHeight = img.offsetHeight;
    newCanvas.setAttribute('width',imgWidth);
    newCanvas.setAttribute('height',imgHeight);
    img.remove();
    //img.style.display = 'none';
    doc.body.appendChild(newCanvas);
    var canvasContext = doc.getElementById('canvas').getContext("2d"),
        cImg = new Image();
    cImg.onload = function() {
        canvasContext.drawImage(cImg,0,0);
    }
    cImg.src = img.src;
}
insertCanvas();

/**
 *@synopsis 元素定位
 */
var loadPosition = function() {
    var main = doc.getElementById('main');
    main.style.marginLeft = -(main.offsetWidth / 2) + 'px';
    var canvas = doc.getElementById('canvas'),
        bWidth = doc.body.clientWidth,
        canvasWidth;
    canvasWidth = canvas.offsetWidth;
    if(bWidth > canvasWidth) {
        canvas.style.marginLeft = (bWidth - canvasWidth) / 2;
    }
}

/**
 *@synopsis 当窗口大小变化时重新定位元素
 */
window.onresize = function() {
    loadPosition();
}
/**
 *@synopsis 向页面中插入底部控制面板
 */

var insertPanel = function() {
    var mainDiv = doc.createElement("div");
    mainDiv.setAttribute("id","main");
    mainDiv.setAttribute("class","main");
    mainDiv.appendChild(createButton('wMeasure','btn btn-primary','测量宽度'));
    mainDiv.appendChild(createButton('hMeasure','btn btn-success','测量高度'));
    mainDiv.appendChild(createButton('getColor','btn btn-info','取色'));
    mainDiv.appendChild(createButton('Mouse','btn btn-warning','指针移动'));
    mainDiv.appendChild(createButton('save','btn btn-danger','保存'));
    doc.getElementsByTagName("body")[0].appendChild(mainDiv);
    loadPosition();
}

insertPanel();


