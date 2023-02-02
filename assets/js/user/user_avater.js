$(function () {
    var layer = layui.layer;


    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比【裁剪区域，正方形是1，长方形可以设置为16/9  宽/高】
        aspectRatio: 1,
        // 指定预览区域【就是裁剪区的右边2个显示窗口】
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)


    // 为上传按钮绑定点击事件
    $("#btnChooseImage").on("click", function () {
        $("#file").click();
    })


    // 为文件选择框绑定 change 事件
    $("#file").on("change", function (e) {
        // 获取用户选择的文件
        var filelist = e.target.files;
        //检验用户是否选择文件
        if (filelist.length === 0) {
            return layer.msg('请选择照片！');
        }


        // 1. 拿到用户选择的文件
        var file = e.target.files[0];
        // 2. 根据用户拿到文件转换为一个url地址
        var newImgURL = URL.createObjectURL(file);
        // 3. 先销毁旧裁剪区旧图片路径，再重新设置新图片路径。
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })


    // 为确定按钮绑定事件
    $("#btnUpload").on("click", function () {
        // 1. 要拿到用户裁剪之后的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串


        // 2. 调用接口，把头像上传到服务器
        $.ajax({
            method: "POST",
            url: "/my/update/avatar",
            // data 是参数。 avatar 是头像的参数 【填dataURL 拿到转化完成的base64 格式字符串】
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("上传失败")
                }
                layer.msg("上传成功");

                // 刷新父页面的用户头像
                window.parent.getUserInfo();
            }
        })
    })


})