let isInput = true;
let Box = document.querySelector(".Box");
let content = document.querySelector(".content");
let input = document.querySelector("#input");
let start = document.querySelector(".start");
let reback = document.querySelector(".reback");

whoShow();
start.onclick = function () {
    // err
    let err = "Matrix is ERR.";
    if (input.value == err) input.value = null;

    // console.log(input.value);
    let str = input.value.replace(/ /g, "");

    input.value = str;

    // 需要计算的数独
    let data;

    if (str.length == 81) {
        isInput = false;
        data = rp(str);
    }

    // 测试
    if (str == "d") {
        isInput = false;
        data = demo;
    }

    if (!isInput) {
        input.value = "init ...";

        if (startM(data)) {
            start.innerHTML = "ok";
            start.style.background = "rgb(10, 183, 39)";
            setTimeout(() => {
                whoShow();
                setTimeout(()=>{
                    start.innerHTML = "start";
                    start.style.background = "#E03616";
                },1000);
            }, 500);
        } else {
            isInput = true;
            input.value = err;
        }
    }


};

reback.onclick = function () {
    isInput = true;
    input.value = null;
    whoShow();
};

input.addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        start.click();
    }
});

let demo = [
    0, 6, 1, 0, 3, 0, 0, 2, 0,
    0, 5, 0, 0, 0, 8, 1, 0, 7,
    0, 0, 0, 0, 0, 7, 0, 3, 4,

    0, 0, 9, 0, 0, 6, 0, 7, 8,
    0, 0, 3, 2, 0, 9, 5, 0, 0,
    5, 7, 0, 3, 0, 0, 9, 0, 0,

    1, 9, 0, 7, 0, 0, 0, 0, 0,
    8, 0, 2, 4, 0, 0, 0, 6, 0,
    0, 4, 0, 0, 1, 0, 2, 5, 0,
];


function whoShow() {
    let [content, tinput] = [$(".content"), $(".Toinput")];
    let [cc, tt] = [$(".content .c"), $(".Toinput .text-input")];
    if (isInput) {
        content.fadeOut(1000);
        content.css({
            transform: "rotateY(180deg)",
        })
        cc.css({
            transform: "translateZ(-1000px)",
        })

        tinput.fadeIn();
        tinput.css({
            transform: "rotateY(0deg)",
        })
        tt.css({
            transform: "translateZ(0px)",
        })

        // $("#div3").fadeIn(3000);
    } else {
        // textInput.style.display = "none";
        // content.style.display = "block";
        content.fadeIn();
        content.css({
            transform: "rotateY(0deg)",
        })
        cc.css({
            transform: "translateZ(0px)",
        })

        tinput.css({
            transform: "rotateY(-180deg) ",
        })
        tinput.fadeOut(1000);
        tt.css({
            transform: "translateZ(-1000px)",
        })
    }
}

function startM(data) {

    Box.innerHTML = null;

    V.startM(data);

    if (!V.isOk()) {
        return false;
    }

    let m = [...V.matrix], ex = [...V.finishCell];

    for (let x = 0; x < m.length; x++) {
        const raw = m[x];
        for (let y = 0; y < raw.length; y++) {
            const number = raw[y];

            if (ex.some(f => {
                return f.toString() == [x, y].toString();
            })) {
                createLi(number, "b b_in");
            } else {
                createLi(number);
            }
        }
        let br = document.createElement("br");
        Box.appendChild(br);
    }

    //创建格子
    function createLi(text, c = "b") {
        var li = document.createElement("li");
        li.innerHTML = `<p class="${c}">${text}</p>`;
        li.className = "block";
        Box.appendChild(li);
    }

    return true;

}
