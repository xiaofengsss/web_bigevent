$(function () {
    var layer = layui.layer;
    var form = layui.form;

    // 初始化富文本编辑器
    initEditor()

    initCate()
    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",

            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("初始化文章分类失败");
                }

                layer.msg("初始化文章分类成功");
                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template("tpl-cate", res);
                $("[name=cate_id]").html(htmlStr);
                // 一定要记得调用 form.render() 方法
                form.render();

                // 根据id值  向服务器获取文章数据。
                retrieveData()
            }
        })
    }


    // 裁剪图片的脚本调用
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)



    // 为选择封面的点击按钮，绑定点击事件处理函数
    $("#btnChooseImage").on("click", function () {
        $("#coverFile").click();

    })


    // 监听 coverFile 的 change 事件，获取用户选择的文件列表
    $("#coverFile").on("change", function (e) {
        // 获取到文件的列表数组
        var files = e.target.files;

        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }


        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0]);


        // 为裁剪区域从新设置图片了
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })


    // 定义文章发布的状态
    var art_state = "已发布";

    // 为 存为草稿 按钮，绑定点击事件处理函数
    $("#btnSave2").on("click", function () {
        art_state = "草稿";
    })


    // 为表单绑定 submit 提交事件
    $('#form-pub').on("submit", function (e) {
        // 1. 阻止表单默认提交行为
        e.preventDefault();

        // 2. 基于这个form表单，快速创建一个 FormData 对象。
        var fd = new FormData($(this)[0]);

        // 3. 将文章的发布状态，存入 fd 中
        fd.append('state', art_state);

        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作

                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob);


                // 6. 发起 ajax 数据请求
                // publishAricle 发布文章的意思
                publishAricle(fd);

            })
        // 把id值  追加到fd实例对象里面
        fd.append('Id', idnum);

    })

    // 定义一个发布文章的方法
    function publishAricle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("发布文章失败！")
                }
                layer.msg("发布文章成功！");


                // 发布文章后，跳转到文章列表页面
                location.href = '/article/art_list.html';
            }
        })
    }



    // 在文章列表页获取回来的 id值
    var idnum = localStorage.getItem('idnum');
    console.log(idnum);

    // 根据id 获取数据
    function retrieveData() {
        $.ajax({
            method: 'GET',
            url: '/my/article/' + idnum,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取id数据失败');

                }

                console.log(res.data);

                // 快速加载表单内容，【两input文本框内容】
                form.val("formUserInfo", res.data);



                // 更改 TinyMCE 内容设置。
                $(document).ready(function () {
                    // 初始化 TinyMCE 插件
                    tinymce.init({
                        selector: 'textarea',
                        plugins: 'advlist autolink lists link image charmap print preview',
                        toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | image',
                    });

                    // 获取 TinyMCE 插件的编辑器实例
                    var editor = tinymce.activeEditor;

                    // 将 TinyMCE 插件的内容设置为 "Hello, World!"
                    // editor.setContent("Hello, World!");
                    editor.setContent(res.data.content);

                    // // 当 TinyMCE 插件获得焦点时，将其内容替换为 "New Text"
                    // editor.on('focus', function () {
                    //     editor.setContent("New Text");
                    // });
                });

                //  无法加载从服务器获取到的 Cropper url地址图片
            }
        })
    }


})









