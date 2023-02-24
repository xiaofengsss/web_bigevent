$(function () {

    // 导入layui对象
    var layer = layui.layer;//弹窗对象
    var form = layui.form;//表单对象
    var laypage = layui.laypage;//页码对象


    // 定义 优化时间的过滤器 dataFormat
    template.defaults.imports.dataFormat = function (data) {
        var dt = new Date(data);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var h = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());
        return y + "-" + m + "-" + d + "  " + h + ":" + mm + ":" + ss;
    }



    //定义补零的函数 padZero
    // n小于9 就补0
    function padZero(n) {
        return n < 9 ? "0" + n : n;
    }


    //定义一个查询的参数对象，将来请求数据的时候
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值，默认请求第一页的数据
        pagesize: 2,//每页显示几条数据，默认每页显示2条
        cate_id: '',//文章分类的 Id
        stateh: '',//文章的发布状态
    }



    initTable()
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // layer.msg('获取文章列表成功！')

                // 使用模板引擎渲染数据
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr)


                // 当表格渲染完成后，就执行渲染分页码的方法
                // 传参值：数据的总数
                renderPage(res.total);

            }
        })
    }

    initCate()

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: "GET",
            url: '/my/article/cates',

            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取数据失败')
                }
                var htmlStr = template("tpl-cate", res);
                $("[name=cate_id]").html(htmlStr);

                // 调用render() 方法。
                form.render();
            }
        })
    }


    // 为筛选表单做submit事件
    $("#form-search").on("submit", function (e) {
        e.preventDefault();

        // 获取表单中选中的值
        var cate_id = $('[name = cate_id]').val();
        var stateh = $('[name = stateh]').val();

        // 为查询参数对象 q 中对应的属性值、
        q.cate_id = cate_id;
        q.stateh = stateh;

        // 根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })


    // 定义渲染分页的方法
    function renderPage(total) {

        // 调用laypage.render() 方法来渲染分页结构
        laypage.render({
            elem: 'pageBox',  //分页容器是id名称，不用加 # 号
            count: total,//总数据条数，从服务端得到
            limit: q.pagesize, //每页显示多少钱数据
            curr: q.pagenum,//设置默认被选中的分页
            // 添加自定义分页的功能
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],

            // 设置显示多少条数据配置项
            limits: [2, 3, 5, 10],



            //  分页发生切换的时候，触发 jump 回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页面的时候，会触发。
            // 2. 只要调用  laypage.render()函数也会触发。
            jump: function (obj, first) {
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr;

                // 把最新的显示条数，赋值到 q 这个查询参数对象中
                q.pagesize = obj.limit;

                // 可以通过 first 的值，来判断是通过那种方式触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2来触发的，否则就是方式1来触发的。
                if (!first) {
                    // do something
                    // 根据最新的 q 获取对应的数据列表，并渲染表格
                    initTable();
                }
            }

        })
    }


    // 通过代理的形式，为删除按钮绑定点击事件处理函数
    $("body").on("click", ".btn-delete", function () {
        // 获取页面上所以删除按钮个数
        var len = $(".btn-delete").length;

        // 获取到文章id
        var id = $(this).attr("data-id");

        // 询问用户是否要删除数据
        layer.confirm('确定要删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: "GET",
                url: '/my/article/delete/' + id,
                // data: num,
                success: function (res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg("删除文章失败");
                    }
                    layer.msg("删除文章成功");


                    //如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                    // 当数据删除完成后，需要判断当前这一页，是否还剩余的数据
                    // 如果没有剩余的数据了，则让页码值 -1 之后，
                    if (len === 1) {
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }


                    // 再从新调用 initTable() 方法
                    initTable()
                }
            })
            layer.close(index);
        });
    })



    // 用代理的方式去获取当前行的id值，
    var id = null;
    $('tbody').on("click", ".btn-edit", function () {


        id = $(this).attr("data-id");

        // 把当前id值 存储到 localStorage 
        localStorage.setItem("idnum", id);


        // 页面跳转到 修改文章
        location.href = '/article/art_revise.html';
    })



})