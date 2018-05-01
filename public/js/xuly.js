var socket = io('http://localhost:3000');
socket.on('dangky_thatbai', function () {
    alert("Dang ky that bai")
});
socket.on('dangky_thanhcong',function (data) {
    $('#currenUser').html(data);
    $("#loginForm").hide(2000);
    $("#chatForm").show(1000);
})

socket.on("server_send_message", function (data) {
    $("#listMessages").append("<div class='ms_all'>"+data.un +" : "+ data.nd +"</div")
})
socket.on("server_send_message_me", function (data) {
    $("#listMessages").append("<div class='ms_me'>"+data.un +" : "+ data.nd +"</div");
})
socket.on("openbox",function (data) {
    $(".msg_box").show();
    $("#box_name").html(data.nick);
})
socket.on("new_message",function (data) {
    $(".msg_main").append("<div class='ms_all'>"+data.nick +" : "+ data.msg +"</div")
    console.log(data);
})


$(document).ready(function () {
    $("#loginForm").show();
    $("#chatForm").hide();
    $(".msg_box").hide();

    $('#btn_dangky').click(function () {
        var message = $('#textUsername').val();
        socket.emit("dk_username",message);
    });
    $('#btnLogout').click(function () {
        socket.emit("logout");
        $("#loginForm").show(2);
        $("#chatForm").hide(1);
    });
    $("#send").click(function () {
        var message = $('#message').val();
        socket.emit("send_message",message);
    })
    socket.on("danhsach_user", function (data) {
        $("#boxContent").html("");
        data.forEach(function (i) {
            $("#boxContent").append("<div class='useronline'>"+ i +"</div>");
        });
        usernameClick();
    })
    function usernameClick(){
        $('.useronline').click(function () {
            $(".msg_box").show();
            socket.emit("open-chatbox",$(this).text());
            $("#box_name").html($(this).text());
        })
    }
    $("#target").submit(function (event) {
        event.preventDefault();
        var msg = $(".set_message").val();
        var sendto = $("#box_name").html();
        socket.emit("send_message_one",{msg:msg, sendto:sendto});
        $(".set_message").val("");
    });
})