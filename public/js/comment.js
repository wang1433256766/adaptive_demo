//初始化加载
$(function() {
    $("#content>div").hide(); // Initially hide all content
    $("#tabs li:first").attr("id", "current"); // Activate first tab
    $("#content>div:first").fadeIn(); // Show first tab content

    $('#tabs a').click(function(e) {
        e.preventDefault();
        $("#content>div").hide(); //Hide all content
        $("#tabs li").attr("id", ""); //Reset id's
        $(this).parent().attr("id", "current"); // Activate this
        $('#' + $(this).attr('title')).fadeIn(); // Show content for current tab
    });

    //获取数据
    getData(1);

    //提交评论
    $(".submit button").click(function() {
        var content = $("#issues").val();
        $.ajax({
            type: 'POST',
            url: URI_DOMAIN + '/comment/insert',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            data: { article: '1000001', content: content },
            success: function(res) {
                if (res.status == 1) {
                    getData(1);
                    $("#issues").val('');
                }
                alert(res.msg);
            }
        })
    })
});

//获取数据
function getData(currentPage) {
    /**
     * 默认情况下，跨源请求不提供凭据(cookie、HTTP认证及客户端SSL证明等)。
     * 通过将withCredentials属性设置为true，可以指定某个请求应该发送凭据。
     * 如果服务器接收带凭据的请求，会用下面的HTTP头部来响应。
     *  Access-Control-Allow-Credentials: true。
     */
    $.ajax({
        async: false, //同步
        type: 'GET',
        url: URI_DOMAIN + '/comment/query',
        dataType: 'json',
        // xhrFields: {
        //     withCredentials: true
        // },
        data: { articleId: '1000001', page: currentPage, size: 10 },
        success: function(res) {
            if (res.status === 1) {
                var resData = res.data.data;
                var totalPage = Math.ceil(res.data.total / 10); //总页数
                var li_html = "";
                for (var i = 0; i < resData.length; i++) {
                    li_html += '<li class="tab1-li">' +
                        '<div class="tab1-comment"><a href="./comment_reply.html?commentId=' + resData[i].id + '">' + resData[i].content + '</a></div>' +
                        '<div class="tab1-info">' +
                        '<span class="tab1-reply">' + resData[i].replies.length + ' reply</span>' +
                        '<span class="tab1-date-author">' + new Date(resData[i].createtime).format('yyyy-MM-dd') + ' by  <span class="author">' + resData[i].uname + '</span></span>' +
                        '</div>' +
                        '</li>' +
                        '<hr style="width:95%;margin:0 auto;opacity: 0.3;">';
                }
                $(".tab1-ul").html(li_html);
                //加载分页控件，第一次加载会自动触发一次change事件
                $("#pager").pager({
                    pagenumber: currentPage,
                    pagecount: totalPage,
                    buttonClickCallback: PageClick
                });

            }
        }
    })
}
//分页
var PageClick = function(pageclickednumber) {
    getData(pageclickednumber);
}