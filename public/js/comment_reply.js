//获取url参数
/*
encodeURI()是Javascript中真正用来对URL编码的函数
eg:
	编码：	Javascript:encodeURI("春节");
	解码:	Javascript:decodeURI("%E6%98%A5%E8%8A%82");
*/
(function($) {
    $.getUrlParam = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    }
})(jQuery);

var commentId = $.getUrlParam('commentId');

$(function() {
    //获取对应问题的详细信息（包括评论）
    getData();

    //添加评论
    $(".reply-input button").click(function() {
        var reply_content = $(".reply-input input").val();
        if (!reply_content) {
            alert('请填写评论内容！');
            return false;
        }
        $.ajax({
            type: 'POST',
            url: URI_DOMAIN + '/reply/insert',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            data: { commentid: commentId, content: reply_content },
            success: function(res) {
                if (res.status == 1) {
                    $(".reply-input input").val('');
                    getData();
                }
                alert(res.msg);
            }
        })
    })

    //返回问题列表页
    $("#reback").click(function() {
        window.location.href = './comment.html'
    })
})

function getData() {
    $.ajax({
        type: 'GET',
        url: URI_DOMAIN + '/comment/queryOne',
        dataType: 'json',
        data: { commentId: commentId },
        success: function(res) {
            if (res.status == 1) {
                var resData = res.data;
                var replyList = res.data.replies; //回答列表
                var li_html = "";
                var replyContentArr = [];
                $(".comment-content").text(unescapeHTML(resData.content));
                $(".comment-reply span").text(replyList.length);
                $(".comment-date").text(new Date(resData.createtime).format('yyyy-MM-dd'));
                $(".author").text(resData.uname);
                //获取评论列表
                if (replyList) {
                    for (var i = 0; i < replyList.length; i++) {
                        var replyContent = "";
                        var xssContent = unescapeHTML(replyList[i].content);
                        replyContentArr = xssContent.split(' '); //将字符串已空格分割为数组
                        if (replyContentArr[0] === '@' && replyContentArr.length > 2) {
                            replyContent += '<span style="color:#bf5640;font-size:12px;font-weight:bold;">' + replyContentArr[0] + ' ' + replyContentArr[1] + ' </span>';
                            replyContentArr.splice(0, 2); //去除数组前两个元素；第一个参数代表起始位置，第二个代表长度
                            replyContent += replyContentArr.join(' '); //以空格形式将数组拼接成字符串
                        } else {
                            replyContent = replyContentArr.join(' ');
                        }
                        li_html += '<li class="reply-li">' +
                            '<div class="reply-content">' +
                            '<span class="reply-author">' + replyList[i].uname + ':</span>&nbsp;&nbsp;' +
                            '<span>' + replyContent + '</span>' +
                            '</div>' +
                            '<div class="reply-info">' +
                            '<a class="reply-opt" onclick="replyTo(\'' + replyList[i].uname + '\')">reply</a>' +
                            '<span class="reply-date">' + new Date(replyList[i].createtime).format("yyyy-MM-dd") + '</span>' +
                            '</div>' +
                            '</li>' +
                            '<hr style="width:100%;margin:0 auto;opacity: 0.3;">';
                    }
                }
                $(".reply-ul").html(li_html);
            }
        }
    })
}

//@XX
function replyTo(uname) {
    var prefix = '@ ' + uname + ' ';
    $(".reply-input input").val(prefix);
    $(".reply-input input").focus();
}