
let historyData = [];

let slide = $(".toSlide");
let sidebar = $(".sidebar");
let history = $(".history");
let historyList = $(".history .list");

// 侧边栏是否展示
let open = false;
// 记录开始 bar 是否为空
let isEmptyBar = true;

if (isEmptyBar) {
    historyList.append(`<p style="margin: 35px;color: #615858;text-align: center;"> Empty </p>`);
}

let testDate = "98.7..6..5...9..7...7..4...3....6.....85...6.......3.2.1.........54...8.....219..";

// 点击侧边栏展示
slide.click(function (e) { 
    e.preventDefault();

    open = !open;

    if(open){
        sidebar.css({
            animationName: "sidebarShow",
        });
        slide.css({
            animationName: "sidebarSwitchOpen",
        });
        
    }else{
        sidebar.css({
            animationName: "sidebarClose",
        });
        slide.css({
            animationName: "sidebarSwitchClose",
        });
    }
    log("slide: ", open);
});


// 点击历史父级
historyList.click(function (e) {
    e.preventDefault();

    let self = $(e.target);
    
    // 历史子级被点击
    if (self[0].nodeName == "LI") {
        const isShowed = self.attr("show") == "false" ? true : false;
        listClick(self, isShowed);
        return;
    };

    // 时间记录被点击
    let className = self.prop("className");
    let patt = new RegExp("op");

    if(patt.test(className)){
        log("this is op");
        optionClick(self);
    }
    // 
});



// 历史子级被点击
function listClick(self, isShowed) {

    // 如果 show 属性为 false 则设置css 显示
    if (isShowed) {
        // 添加展示的样式
        self.addClass("hisliShow");
        // 在后面添加一个小时钟样式的节点，
        // 用于点击后，展示事件记录的按钮
        liAppend(self, "op");
        // 展示详细历史时间记录的节点
        // liAppend(self, "details");
    } else {
        // 恢复原来的样式
        self.removeClass("hisliShow");
        // 删除小时钟
        self.find(".op").remove();
        // 删除详情
        // self.find(".details").remove();
    }
    self.attr("show", isShowed);

    // 添加节点
    function liAppend(obj, className, nodeName = "div") {
        let option = document.createElement(nodeName);
        option.className = className;
        obj.append(option);
    }
}

function optionClick(obj){
    let details = obj.next();

    details.css({
        backgroundColor: "#aaa",
    });

}

// 创建一个历史记录节点
function createHistoryLi(text) {
    let li = document.createElement("li");
    li.className = "hisli";

    li.innerHTML = text;
    li.setAttribute('show', "false");
    historyList.append(li);
}



// 展示历史的纤细信息


// let historyList = ;
