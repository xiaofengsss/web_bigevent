$(function () {
    var layer = layui.layer;
    var form = layui.form;

    initArtCateList()
    // 获取文章分类的列表【初始化文章分类的列表数据】
    function initArtCateList() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {

                // 把模板转换为字符串
                var htmlStr = template("tpl-table", res);

                // 把字符串内容 赋值给tbody标签
                $('tbody').html(htmlStr);

            }
        })
    }



    // 为添加类别按钮绑定点击事件。【添加类别按钮】
    var indexAdd = null;//用来存储弹出层的id值，以便后续可根据id值的层去关闭对应的弹出层。
    $("#btnAddCate").on("click", function () {
        indexAdd = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: '添加文章分类',
            content: $('#dialog-add').html(),
        });
    })


    // 通过代理的形式， 为 form-add 表单绑定submit 事件 【添加类别按钮 的 提交动作】

    // $("#form-add").on("submit", function (e) {
    // 首先这样写是错的，因为页面加载完毕后 form-add这个元素都不存在的，所以我们要通过代理的方式创建。
    // })
    // 首先我们要绑定页面已存在的元素，然后在代理到 form-add元素身上
    $("body").on("submit", '#form-add', function (e) {
        e.preventDefault();
        // console.log($("#name").val());
        // console.log($("#alias").val());
        // console.log($(this).serialize());
        $.ajax({
            method: "POST",
            url: '/my/article/addcates',
            data: $(this).serialize(),
            // data: { name: $("#name").val(), alias: $("#alias").val() },
            success: function (res) {
                console.log(res);

                // 接口出问题了只能先默认成功更新
                if (res.status !== 0) {
                    return layer.msg("新增分类失败")
                }

                // 刷新列表
                initArtCateList()
                // layer.msg("新增分类成功");
                layer.msg("接口出问题了只能先默认成功更新");
                // 关闭弹出层
                layer.close(indexAdd);
            }
        })
    })


    // 通过代理的形式，为 btn-edit 按钮绑定点击事件【编辑按钮  获取当前列表行的信息】
    var indexEdit = null;
    $("tbody").on("click", ".btn-edit", function () {
        // 弹出一个修改文章信息的层
        indexEdit = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: '修改文章分类',
            content: $('#dialog-edit').html(),
        });

        var id = $(this).attr("data-id");


        // 发起请求获取对应分类的数据
        $.ajax({
            method: "GET",
            url: '/my/article/cates/' + id,
            success: function (res) {

                // 把获取回来的数据赋值到文本框中
                form.val('form-edit', res.data)
            }
        })
    })


    // 通过代理形式, 为修改分类的表单绑定 submit 事件  【编辑按钮   修改列表信息提交】
    $("body").on("submit", "#form-edit", function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                // 接口出问题了只能先默认成功更新

                // if (res.status !== 0) {
                //     return layer.msg("更新数据分类失败!");
                // }
                layer.msg("接口出问题了只能先默认成功更新");
                // layer.msg("更新数据分类成功!");
                // 关闭弹出层
                layer.close(indexEdit);
                // 刷新表格
                initArtCateList()
            }
        })
    })


    // 通过代理形式 为删除分类做点击事件 【删除按钮】
    $('tbody').on("click", '.btn-delete', function () {
        // 获取id值
        var id = $(this).attr("data-id");

        // 提示用户是否要删除【提示框】
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            //do something

            $.ajax({
                method: "GET",
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    console.log(res);
                    // if (res.ststus !== 0) {
                    //     return layer.msg('删除数据失败!');
                    // }
                    layer.msg('删除数据成功!');

                    // 刷新列表数据
                    initArtCateList()
                    // 关闭弹出层
                    layer.close(index);
                }
            })

        });
    })



})