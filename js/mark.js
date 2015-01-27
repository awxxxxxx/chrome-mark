/*
 *chrome测量、标注图片插件
 *
 *@author:waterbear
 */
'use strict';
console.log("匹配成功");
var doc = document;
/**
 *@synopsis 创建button按钮
 *@param bId 按钮的id
 *@param bClass按钮的class
 *@param bContent 按钮里面的内容
 *@returns 返回创建好的按钮
 */

var createButton = function(bId,bClass,bContent) {
    var button = doc.createElement("a");
    button.href = "#";
    button.setAttribute("id",bId);
    button.setAttribute("class",bClass);
    button.innerHTML = bContent;
    return button;
}
/**
 *@synopsis 向页面中插入底部控制面板
 */

var insertPanel = function() {
    var mainDiv = doc.createElement("div");
    mainDiv.setAttribute("id","main");
    mainDiv.setAttribute("class","main");
    mainDiv.appendChild(createButton('wMeasure','button','测量宽度'));
    mainDiv.appendChild(createButton('hMeasure','button','测量高度'));
    mainDiv.appendChild(createButton('getColor','button','取色'));
    mainDiv.appendChild(createButton('Mouse','button','指针移动'));
    doc.getElementsByTagName("body")[0].appendChild(mainDiv);
}

/**
 *@synopsis 加载外部样式
 *@param url 外部样式地址
 */
var loadStyle = function(url) {
    var link = doc.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = url;
    var head = doc.getElementsByTagName("head")[0];
    head.appendChild(link);
    insertPanel();
}
loadStyle('../css/mark.css');

