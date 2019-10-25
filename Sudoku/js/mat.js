let rp = x=> x.replace(/\./g,"0");

const V = { 
    init: (data) => {
        V.util.sum=[0,0,0,0,0];
        V.matrix = [];
        V.emptyCell = [];
        V.finishCell = [];
        V.depthArr = [];

        if(data){
            // 定义二维数组
            for (let i = 0; i < 9; V.matrix[i++] = new Array());

            // 如果传入的数值是字符串，则处理成数组
            if (!(data instanceof Array)) {
                // 去除所有非数字
                data = data.replace(/\D/g, "");
                // 分离所有数字
                data = data.split("");
            }

            console.log(data.length);
            if(data.length == 81){
                // 初始化数组
                V.format(data);

                // 删除数组里的某个元素
                Array.prototype.remove = function (val) {
                    for (let i = 0; i < this.length; i++) {
                        let sf = this[i];
                        if (sf.toString() == val.toString()) {
                            this.splice(i, 1);
                            // log("remove ok.")
                        }

                    }
                };

                log("Matrix init ok.");
            }else{
                log("Matrix init ERR.");
            }
        }else{
            log("Matrix init ERR.");
        }
    },
    // 保存并要操作的数据
    matrix: new Array(),
    // 记录空的地方
    emptyCell: new Array(),
    // 记录 原始数据 非空的地方
    finishCell: new Array(),
    // 记录深度
    depthArr: new Array(),
    // 数组保存样式，空的地方使用空的数组表示
    format: (data) => {
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                let d = data[9 * x + y];
                d = parseInt(d);
                if (d) { // 数组中存在的数
                    V.matrix[x][y] = d;
                    // 记录下非空的地方
                    V.finishCell.push([x, y]);
                } else { // 不存在则输出[]
                    V.matrix[x][y] = [];
                    // 记录下空的地方
                    V.emptyCell.push([x, y]);
                }
            }
        }
    },
    block: (doIt, which) => {
        for (let x = 0; x < 9; x = x + 3) {
            for (let y = 0; y < 9; y = y + 3) {

                /* 如果which 为空，则循环输出所有
                *  否则输出选中的模块 
                */
                if (which instanceof Array && which.length == 2) {
                    let b = [3 * which[0], 3 * which[1]];
                    if (b.toString() != [x, y].toString()) continue;
                }

                /* 以[...]的形式输出一个宫格的数据
                *
                *  1  2  3
                *  4  5  6   =>  [1, 2, 3, 4, 5, 6, 7, 8, 9]
                *  7  8  9
                * 
                */

                let mat = new Array(9);
                for (let xi = 0; xi < 3; xi++) {
                    for (let yi = 0; yi < 3; yi++) {
                        let v = V.matrix[x + xi][y + yi];
                        mat[3 * xi + yi] = v;
                    }
                }
                mat = doIt(mat);
                if (mat) {
                    // 将处理的数据放回去
                    for (let xi = 0; xi < 3; xi++) {
                        for (let yi = 0; yi < 3; yi++) {
                            V.matrix[x + xi][y + yi] = mat[3 * xi + yi];
                        }
                    }
                } else {
                    // log("block 方法返回值有错，原数值不变.");
                }
            }
        }
    },
    raw: (doIt, which) => {
        let mat = new Array(9);
        // 取
        for (let x = 0; x < 9; x++) {

            // 是否循环全部取出
            if (which != null) {
                if (which != x) continue;
            }

            mat = V.matrix[x];
            mat = doIt(mat);

            if (mat) {
                // 写入
                V.matrix[x] = mat;
            } else {
                // log("raw 方法返回值有错，原数值不变.");
            }
        }

    },
    col: (doIt, which) => {

        // 取
        for (let y = 0; y < 9; y++) {

            // 是否循环全部取出
            if (which != null) {
                if (which != y) continue;
            }

            let mat = new Array(9);
            for (let x = 0; x < 9; x++) {
                //mat[y] = V.matrix[x][y];
                // log(mat[y]);
                mat[x] = V.matrix[x][y];
            }

            mat = doIt(mat);
            if (mat) {
                // 写入
                for (let x = 0; x < 9; x++) {
                    V.matrix[x][y] = mat[x];
                }
            } else {
                // log("col 方法返回值有错，原数值不变.");
            }
        }
    },
    print: (style) => {
        for (let x = 0; x < V.matrix.length; x++) {
            let elem = V.matrix[x];

            if (x % 3 == 0) log("======================================");
            let str = "";
            for (let i = 0; i < elem.length; i++) {
                if (i % 3 == 0) {
                    str += "|  ";
                }

                let s = "";
                if (!style) {
                    s = elem[i] instanceof Array ? "_" : elem[i];
                }
                else if (style == 1) {
                    s = elem[i] instanceof Array ? "["+ elem[i] +"]" : elem[i];
                }
                else if (style == 2){
                    let inCell = V.finishCell.filter((f)=>{
                        return f.toString() == [x,i].toString();
                    });
                    s = inCell.length ? " "+elem[i]+" ": "_"+ elem[i] +"_";
                }
                str += s + "  ";
            }
            log(str);
        };
    },
    updateEmptyCell: () => {
        V.emptyCell = [];
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                if (V.matrix[x][y] instanceof Array) {
                    // 记录下空的地方
                    V.emptyCell.push([x, y]);
                }
            }
        }
    },
    sortEmptyCell: () => {
        /* 将空格中可能的个数进行排列
        *  [2,3,4] [3,4] [3,4,5]=> [3,4] [2,3,4] [3,4,5]
        *  从可能填的数最少的开始推测
        */
        V.emptyCell.sort((a, b) => {
            return V.matrix[a[0]][a[1]].length - V.matrix[b[0]][b[1]].length;
        })
    },
    // 检查是否填写的合法，如果出现可能的数为零，即出错
    validate: () => {
        // 在未完成的情况下
        if (V.emptyCell.length) {
            V.sortEmptyCell();
            let [x, y] = [V.emptyCell[0][0], V.emptyCell[0][1]];
            if (!(V.matrix[x][y].length)) {
                return false;
            }
        }
        return true;
    },
    // 检查是否输入合法
    _check: true,
    checkM: () =>{
        // 是否合法
        _check = true;

        // 如果数组为空
        if(!V.matrix.length){
            _check = false;
            return _check;
        }

        let ck = (ds) => {
            // 记录常数
            let dds = [];

            ds.map(d => {
                if (!Array.isArray(d)) {
                    dds.push(d);
                }
            });

            // 删除重复
            let del = Array.from(new Set(dds));
            if (del.length != dds.length) {
               _check = false;
            }
        };

        V.raw(ck);
        V.col(ck);
        V.block(ck);
        return _check;
    },
    // 不检查是否是合法，只看是否没有空，没有数组，则是完成
    isOk: ()=>{
        for (let x = 0; x < V.matrix.length; x++) {
            const raw = V.matrix[x];
            for (let y = 0; y < raw.length; y++) {
                const xy = raw[y];
                if(Array.isArray(raw[y])){
                    return false;
                }
            }
        }
        return true;
    },
    util: {

        // 记录经过的步骤 [ 可能，唯一，假设 ]
        sum : [0,0,0,0,0],
        // 返回发生变化的格子的个数
        fillInPossible : () => {
            V.util.sum[0]++;
            // 空格子的数组
            let m = [...V.emptyCell];
            // 记录改变的格子数
            let chg = 0;

            // 清空所有空格的数据
            m.forEach((elem) => {
                V.matrix[elem[0]][elem[1]] = [];
            });

            m.forEach(elem => {

                // 获取当前格子不能填如的数
                const getExist = (elm) => {
                    let exist = new Array();

                    // 记录当前空格的 行 里面已经存在的数值
                    V.raw((rs) => {
                        rs.forEach((r) => {
                            if (!(r instanceof Array)) {
                                exist.push(r)
                            }
                        })
                    }, elm[0]);
                    // 记录当前空格的 列 里面已经存在的数值
                    V.col((cs) => {
                        cs.forEach((c) => {
                            if (!(c instanceof Array)) {
                                exist.push(c)
                            }
                        })
                    }, elm[1]);

                    // // 记录当前空格的 模块 里面已经存在的数值
                    let bxy = [parseInt(elm[0] / 3), parseInt(elm[1] / 3)]
                    V.block((bs) => {
                        bs.forEach((b) => {
                            if (!(b instanceof Array)) {
                                exist.push(b)
                            }
                        })
                    }, bxy);

                    exist = Array.from(new Set(exist));

                    return exist;
                }

                let exist = getExist(elem);

                let getPossible = (exist) => {
                    let possible = new Array();
                    for (let i = 1; i < 10; i++) {
                        if (exist.indexOf(i) == -1) {
                            possible.push(i);
                        }
                    }

                    // 如果 possible 只有一个数，那么这个格子移出 emptyCell
                    if (possible.length == 1) {
                        V.emptyCell.remove(elem);
                        chg++;
                        // 返回一个数组，不返回数组
                        return possible[0];
                    }

                    return possible;
                }

                // log(exist);
                // log(getPossible(exist)); 

                // 写入当前格可能填写的数
                V.matrix[elem[0]][elem[1]] = getPossible(exist);
            });

            // // 数组更新
            // afreshMatrix();
            return chg;
        },

        // 假设当前空格的值，
        // 如果没有越界，则从 emptyCell 移除， 返回 true
        // 否则不改变，false
        fillInIf : (depth=-1) => {

            if(!V.emptyCell.length) return true;

            V.util.sum[2]++;
            
            // 提示输出
            let tlog = (str,y=false)=>{
                if(y){
                    log(str)
                }
            }

            // 查看假设当前格的次数
            const t = !V.depthArr.length ? null : V.depthArr[depth];
            const chg = !t ? 0 : t.p;

            depth = !V.depthArr.length ? 0 : depth;

            if (t) {

                V.emptyCell = [...t.emptyCell];

                // if (depth < V.depthArr.length - 1) {
                //     V.depthArr.pop();
                // }

                // 如果越界
                if (!t.value[chg]) {
                    // 恢复到上一层
                    V.depthArr.pop();
                    V.emptyCell = [...V.depthArr[V.depthArr.length-1].emptyCell];
                    V.util.fillInPossible();
                    // tlog("fillInIf is overstep.")

                    // 计算回溯重新的次数
                    V.util.sum[3]++;
                    return false;
                }


                let [x, y] = [...t.arr];
                V.matrix[x][y] = t.value[chg];


                V.emptyCell.shift();

                V.util.fillInPossible();

                tlog(`*** depth: ${depth} :: [${t.arr}] => ${t.value} : ${t.value[chg]}`)

                // 计算重新的次数
                V.util.sum[4]++;
                return true;
            }

            let em = [...V.emptyCell];

            /* 将空格中可能的个数进行排列
            *  [2,3,4] [3,4] [3,4,5]=> [3,4] [2,3,4] [3,4,5]
            *  从可能填的数最少的开始推测
            */

            // 经过发现，是否排序真的无所谓，有时更加的慢 ;)
            // em.sort((b, a) => {
            //     return V.matrix[a[0]][a[1]].length - V.matrix[b[0]][b[1]].length;
            // })

            // 使用排序后的数组的第一个开始 假设
            let [x, y] = [...em[0]];

            V.util.fillInPossible();

            tlog(`*** depth: ${depth} :: [${x},${y}] => ${V.matrix[x][y]} : ${V.matrix[x][y][chg]}`)

            // emptyCell 移除第一个 , dedth加入
            V.depthArr.push({
                emptyCell: [...V.emptyCell],
                arr: V.emptyCell.shift(),
                value: V.matrix[x][y],
                _p: 0,
                get p() {
                    this._p++;
                    return this._p;
                }
            });
            
            V.matrix[x][y] = V.matrix[x][y][chg];

            return true;
        },

        // 使用唯一的性质，确定数值
        fillInUnique : () => {
            V.util.sum[1]++;
            // 空格子的数组
            let m = [...V.emptyCell];
            // 记录改变的格子数
            let chg = 0;

            const blockUnique = () => {

                /* 当前空格的 模块 里面，只有一个可能的值
                *  例如这个模块：
                *  7         3        2,4
                *  2,4,8,9   2,4,9    6       => 左下角的1肯定是唯一确定的 
                *  1,2,4,5   2,4,5    2,4
                */

                // 提取出模板，并进行唯一
                for (let x = 0; x < 3; x++) {
                    for (let y = 0; y < 3; y++) {
                        V.block((bs) => {
                            let getAllPossible = [];
                            // 获取数组中的所有数值
                            bs.forEach((b) => {
                                if (b instanceof Array) {
                                    getAllPossible = getAllPossible.concat(b);
                                }
                            })

                            // 查找 getAllPossible 唯一存在的值
                            let unique = [];
                            for (let i = 0; i < getAllPossible.length; i++) {
                                let elm = getAllPossible[i];
                                // 唯一则返回 ture
                                if (getAllPossible.indexOf(elm) != -1 && getAllPossible.indexOf(elm) == getAllPossible.lastIndexOf(elm)) {
                                    unique.push(elm);
                                }
                            }

                            // 如果存在，则更新模块
                            if (unique.length) {
                                unique.forEach((uq) => {
                                    for (let i = 0; i < bs.length; i++) {
                                        let b = bs[i];
                                        if (b instanceof Array && b.indexOf(uq) != -1) {
                                            bs[i] = uq;
                                            V.emptyCell.remove([3 * x + parseInt(i / 3), 3 * y + i % 3]);
                                            chg++;
                                        }
                                    }
                                })
                            }
                            return bs;
                        }, [x, y]);
                    }
                }
            }
            blockUnique();
            return chg;
        },
        // 假设并递归
        /* 
        * 越界：返回上级
        * 不合法： 下一个
        * 无问题： 下级
        * @depth 假设的深度，及总共假设的个数
        * 
        * @reture 越界返回 1 ，不合法返回 2
        */
        _ifAndLoop: function () {

            // 记录开始的数组
            let isY = V.util.fillInIf();
            let depth = 0;

            while(true){
                if(!isY){
                    depth--;
                    // log(`*** depth: ${depth} pre ^`);
                    isY = this.fillInIf(depth);
                    continue;
                }

                // 假设后的重新填如可能的值
                while (V.util.fillInPossible() || V.util.fillInUnique());
                
                if(!V.emptyCell.length) break;
                // 出错
                if(depth >= (81-V.finishCell.length)) break;

                // 是否合法，即是否最后可行，不合法则如下
             
                if (!V.validate()) {
                    // log("Impossible , fillInPossible to it.")
                    isY = this.fillInIf(depth);
                }else{
                    // log("next");
                    depth ++;
                    isY = this.fillInIf(depth);
                }   

            }

        }

    },
    startM : (data, printStyle) => {
        if(!data){
            log("Please input matrix");
            return false;
        }

        // 提示输出
        let tlog = (str, y = false) => {
            if (y) {
                log(str)
            }
        }

        // 初始化
        V.init(data);

        // 输入合法吗
        if(!V.checkM()){
            return false;
        }

        console.time("Time");
        // 填入可能的值，或者唯一
        let fc = V.util;
        while (fc.fillInPossible() || fc.fillInUnique());

        // V.print();

        tlog("Start ...",true);
        tlog("")
        
        fc._ifAndLoop();

        tlog("");
        tlog("Complete !!!",true);
        tlog("");

        V.print(printStyle);
        let [p, u, f, r, af] = [...V.util.sum];
        tlog("");
        tlog(`step: ${p + u + f} => possible:[ ${p} ]  unique:[ ${u} ]  if:[ ${f} ]  reback:[ ${r} ] afresh:[ ${af} ]`,true);
        
        console.timeEnd("Time");
        return true;
    }
}

let v = V;
const log = console.log;









