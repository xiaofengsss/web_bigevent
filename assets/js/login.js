$(function () {
    // 点击“去注册账号”的链接
    $("#link_reg").on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();

    })
    // 点击“去登录账号”的链接
    $("#link_login").on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();

    })


    // 从 layui 中获取 form 对象
    //  因为我们导入了layui的js，所以我们可以用layui对象中的form属性。
    var form = layui.form;
    // 通过 form.verify() 函数自定义校验规则  【verify 是layui内置验证规则】
    form.verify({

        // 把 username 名称像pwd复制到html结构中的input标签里面的lay-verify属性中就可以有用了 
        // username: function (value, item) { //value：表单的值、item：表单的DOM对象
        //     if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
        //         return '用户名不能有特殊字符';
        //     }
        //     if (/(^\_)|(\__)|(\_+$)/.test(value)) {
        //         return '用户名首尾不能出现下划线\'_\'';
        //     }
        //     if (/^\d+\d+\d$/.test(value)) {
        //         return '用户名不能全为数字';
        //     }

        //     //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
        //     if (value === 'xxx') {
        //         alert('用户名不能为敏感词');
        //         return true;
        //     }
        // },

        // 自定义了一个叫做 pwd 校验规则
        // 校验什么：校验了密码不能包含空格，且要求6~12位字符。
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],

        // 校验两次密码是否一致的规则。
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败，则return一个提示消息即可
            var pwd = $(".reg-box [name=password]").val();
            if (pwd !== value) {
                return "两次密码不一致";
            }
        }
    })


    var layer = layui.layer;

    // 监听注册表单的提交事件，
    $("#form_reg").on('submit', function (e) {
        // 阻止表单默认提交行为。
        e.preventDefault();

        // 这是Ajax参数，只是摘取出来到外面。
        var data = { username: $(".reg-box [name=username]").val(), password: $(".reg-box [name=password]").val() };

        // 发起POST请求
        $.post('/api/reguser', data, function (res) {
            console.log(res.status);
            if (res.status !== 0) {
                return layer.msg('用户名被占用，请更换其他用户名！');
            }
            layer.msg('注册成功，请登录！');

            // 当用户注册成功后自动切换到登录界面【模拟用户点击右下角的行为】
            $("#link_login").click();
        })
    })


    // 监听登录表单的提交事件
    $("#form_login").submit(function (e) {
        e.preventDefault();

        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 这是快速获取表单中的数据 serialize() 方法
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('密码错误，请重新输入！');
                };

                layer.msg('登录成功');
                // console.log(res.token);

                // 将登录成功得到的 token 字符串，保存到 localStorage 中
                localStorage.setItem("token", res.token);

                // 跳转到后台主页
                location.href = '/index.html';
            }
        })
    })


})