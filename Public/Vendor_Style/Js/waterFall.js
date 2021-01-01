
(function(exports){

    function minigrid(containerSelector, itemSelector, gutter, animate, done) {
        var returnY;
        var forEach = Array.prototype.forEach; //赋值 方便下面调用（下面有详解）
        var containerEle = document.querySelector(containerSelector); //获取dom(父元素)
        var itemsNodeList = document.querySelectorAll(itemSelector); //获取dom(相对应的子元素)
        gutter = gutter || 6; //获取参数值 若没有则默认6
        containerEle.style.width = ''; //先把父元素宽度赋值空
        var containerWidth = containerEle.getBoundingClientRect().width;//获取父元素宽度 不包含边框
        var firstChildWidth = itemsNodeList[0].getBoundingClientRect().width + gutter; //获取第一个子元素宽度 需要加上一个间隔参数


        var cols = Math.max(Math.floor((containerWidth - gutter) / firstChildWidth), 1); //获取一行最多显示几个子元素 至少为1

        var count = 0; //计数
        /*
        * 计算出父元素的宽度 = (每一行最多显示的个数 * 第一个子元素的宽 + 间距)
        * 这里最好传入的第二个参数最好每一个元素的宽度是一致的 高度无所谓
        */
        containerWidth = (firstChildWidth * cols + gutter) + 'px';
        containerEle.style.width = containerWidth; //给父元素赋值宽 使他可以存放最多个数

        var itemsGutter = []; //定义存放边距的数组
        var itemsPosX = []; //存放边距 第一个 = gutter || 6 第二个 = 1*第一个子元素的宽 + 边距 以此类推
        //循环每一行存放子元素的个数
        for (var g = 0; g < cols; g++) {
            //计算出边距放进数组中
            itemsPosX.push(g * firstChildWidth + gutter);  //获取每个元素距离页面左边距
            itemsGutter.push(gutter); //10

        }
        //console.log(itemsPosX);
        /*
         * 调用数组对象中的原型对象方法
         * @第一个参数是需要使用的数组 这里也就是传进来的第二个参数(所有子节点)
         * @第二个参数是一个函数 可以加2个参数 第一个参数是值 第二个是下标 类似jq中的each懂我意思吧！？算了 写一个看看
         * var keepitem = [];定义一个数组存放值
         * [].forEach.call(["S","C","I","N","F","U","M"],function(item,i){
         *          //这里前面的[]指的是数组 因为只有数组类型才可以调用这个函数
         *          //var forEach = Array.prototype.forEach; 知道我意思了吧 定义了这个就可以省略前面的[]
         *             keepitem.push(item);console.log(i);
         *
         * })；
         * console.log('一个帅帅的小社区'+i);
         * 输出结果
         * 0 1 2 3 4 5 6 一个帅帅的小社区S,c,i,n,F,u,m 就这么个事
         * */
        forEach.call(itemsNodeList, function(item){
            //第一个参数所有的子节点 第二个参数 dom节点(也就是子节点) 别被我绕晕了 输出看看
            //console.log(item);

            var itemIndex = itemsGutter.slice(0).sort(function (a, b) {
                return a - b; //这里因为是按照数组排序 需要sort传递一个函数 a-b是升序 b-a是倒序 返回一个数组
            }).shift(); //返回的数组继续调用shift方法 shift() 方法用于把数组的第一个元素从其中删除，并返回第一个元素的值。
            //console.log(itemIndex); //可以看看
            itemIndex = itemsGutter.indexOf(itemIndex);  //查找存放间隔的数组中是否有按照升序排序过后移出的第一个数 取出他的下标 var index = [10,10,10,10].indexOf(10); 输出0
            //console.log(itemsGutter)
            var posX = itemsPosX[itemIndex] + 8; //这里给下标获取其对应的值 赋值X
            var posY = itemsGutter[itemIndex]; //
            //console.log(posY,posX);
            //兼容各个浏览器
            var transformProps = [
                'webkitTransform',
                'MozTransform',
                'msTransform',
                'OTransform',
                'transform'
            ];

            if (!animate) {

                    forEach.call(transformProps, function(transform){
                        item.style[transform] = 'translate(' + posX + 'px,' + posY + 'px)';
                    });

            }

            returnY = posY;
            itemsGutter[itemIndex] += item.getBoundingClientRect().height + gutter;
            //console.log(itemsGutter);
            count = count + 1;
            if (animate) {
                return animate(item, posX, posY, count);
            }
        });

        var containerHeight = itemsGutter.slice(0).sort(function (a, b) {
            return a - b;
        }).pop();
        if(containerHeight >= 500 ){
            containerEle.style.height = 500+ 'px';
            containerEle.style.overflow = 'auto';
        }
        //containerEle.style.height = containerHeight + 10 + 'px';
        // containerEle.style.paddingBottom = '10px';

        if (typeof done === 'function'){
            done();
        }

        return returnY;
    }

    if (typeof define === 'function' && define.amd) {
        define(function() { return minigrid; });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = minigrid;
    } else {
        exports.minigrid = minigrid;
    }
})(this);