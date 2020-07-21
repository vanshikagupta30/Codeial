// chat sockets vo h jo sbpr nazar rakhega like a server jo sbkuch dekhega(handel) krega
module.exports.chatSockets = function(socketServer){
    let io = require('socket.io')(socketServer);

    // (when I am fring anything then it is emit and when I am getting anything then it is on)

    // here when a connection is estblish then we done a callback fn
    io.sockets.on("connection" , function(socket){
        // socket is an object with a lot of properties of the user which is sending 
        console.log("new connection recieved" , socket.id);

        // whenever the client disconnects or automatic disconnect is fired
        socket.on("disconnect" , function(){
            console.log("Socket disconnected");
        });

        // when a user is connected then it will ask to start or initiate a chat with a specific user, when we click on the user name
        //  then we start a chat with that user.To start a chat with that user we want to create a room for it for that we sends the 
        // request and the other recieve an acknoledgement and whenever the others user comes on9 or join that room we can recieve a 
        // noti that other user has joined that
    
        //Receiving request for joining(like an add event listner .on detects an event that was send by the client)
        socket.on("join_room" , function(data){
            console.log("Joining request received" , data);

            //Joined the user to the chat room(if a chattRoom with this name data.chatroom which is codeial(in chat_engine.js file)is 
            // already exists.So the user will be connected or entered into the chatroom,if it doesn't then it will create that chatroom
            //  and enter the user into it)and after I joined chatroom included me everyone got a message that someone new has join tha chatroom
            socket.join(data.chatroom);

            //Acknowledging all members in the that chat room that new user joined
            // (if we want to emit in a specific chatroom then we will do io.in and then emit otherwise we can do directly emit and data is 
            // the complete data of the user who enterend in the chatroom)
            io.in(data.chatroom).emit("user_joined" , data);
        });

        // Emitting receive messsage event when handled send message
        socket.on("send_message" , function(data){
            console.log("Send message request received");
            io.in(data.chatroom).emit("receive_msg" , data);
        });
    });
}