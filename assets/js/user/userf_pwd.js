$(function () {
    var layer = layui.layer;

    // 密码验证
    var form = layui.form;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],

        // 新密码
        // samePwd 是要给新密码做验证的
        // samePwd里面的value是用来获取当前文本框中的内容。
        samePwd: function (value) {
            if (value === $("[name=oldPwd]").val()) {
                return "新密码不能和旧密码相同"
            }
        },

        // 确认密码
        rePwd: function (value) {
            if (value !== $("[name=newPwd]").val()) {
                return "两次密码不一致"
            }
        }
    })


    // 修改用户账户的密码
    $(".layui-form").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("密码更新失败！")
                };
                layer.msg("密码修改成功！");

                // 重置表单
                //  用原生js语法 【先拿到jquery对象，转换原生js方法 】
                $(".layui-form")[0].reset();
            },
        })
    })

})