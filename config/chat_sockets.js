module.exports.chatSockets = function(socketServer){
    let io = require('socket.io')(socketServer);

    io.sockets.on("connection" , function(socket){
        console.log("new connection recieved" , socket.id);
        socket.on("disconnect" , function(){
            console.log("Socket disconnected");
        });

        socket.on("join_room" , function(data){
            console.log("Joining request received" , data);

            socket.join(data.chatroom);
            io.in(data.chatroom).emit("user_joined" , data);
        });

        // Emitting receive messsage event when handled send message
        socket.on("send_message" , function(data){
            console.log("Send message");
            io.in(data.chatroom).emit("receive_msg" , data);
        });
    });
}