$(function () {
    // 调用 getUserInfo 获取用户基本信息
    getUserInfo();


    var layer = layui.layer;

    // 退出功能
    $('#btnLogout').on('click', function () {

        // 提示用户是否确认退出
        // icon  图标选择
        // title 提示框的标题
        // 第一个 ' '   是提示框中的位置内容
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            // 1. 清空本地存储中的 token
            localStorage.removeItem('token');

            // 文章id
            localStorage.removeItem('idnum');

            // 2. 重新跳转到登录页面
            location.href = '/login.html';

            // 关闭 confirm 询问框
            layer.close(index);
        });
    })
})

// 获取用户基本信息。
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers 就是请求头配置对象
        // headers: {
        //     // 获取身份验证码给 Authorization
        //     Authorization: localStorage.getItem('token') || "",
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败');
            }

            // 调用 renderAvater 渲染用户的头像
            renderAvater(res.data);
        },
        // 不论获取成功还是失败，都会调用complete 回调函数
        // complete: function (res) {
        // 在 complete 回调函数中， 可以使用 res.responseJSON  拿到服务器响应回来的数据。
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
        //         // 1.强制清空 token
        //         localStorage.removeItem('token');
        //         // 2. 强制跳转到登录页面
        //         location.href = '/login.html';
        //     }
        // }
    })
}


//  渲染用户头像
function renderAvater(user) {
    // 1. 获取用户名称【昵称或名称】
    var name = user.nickname || user.username;

    // 2. 设置欢迎的文本
    $("#welcome").html("欢迎&nbsp;&nbsp;" + name);

    // 3. 按需渲染用户的头像
    if (user.user_pic !== null) {
        // 3.1 渲染图片头像
        $(".layui-nav-img").attr('src', user.user_pic).show();
        $(".text-avatar").hide();

    } else {
        // 3.2 渲染文字头像
        $(".layui-nav-img").hide();

        // 获取名称第一个字符，字符有可能是中文也有可能英文。
        // .toUpperCase() 把字符转换为大写字母。
        var first = name[0].toUpperCase();
        // 把转换后的字符渲染到span盒子去。
        $(".text-avatar").html(first).show();
    }
}
