目前假设只能回到之前的两层：  _ifAndLoop


2019.10.24 可以多层

对于输进去的数独没有检验，所以如果开始的数组是不符合规矩的，那么将会报错

里面的 BF 数组里的数独是最难的
使用 BF 数组里的数独，需要先将 "." 转化为 "0", 已经写了一个简单的替换函数 rp
使用如下：

V.startM(rp(BF2[0]))

将输出完成的数组与相关的信息。

