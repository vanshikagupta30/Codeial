// chat engine is us 

class ChatEngine{
    // constructor take 2 things one is the id of the chatbox and second email id of the user
    constructor(chatBoxId , userEmail){
        this.chatBoxId = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

        //Requestion for connection with chat server
        // io is the global variable as soon as we included this file in home.ejs(in cdnjs) and io has been given to us by socket.io file 
        this.socket = io.connect("http://localhost:5000");
        
        // we write this bcoz when user is login then this fn is called and in this fn we had a connection b/w server and the users
        if(this.userEmail){ 
            this.connectionHandler();
        }
        
    }
// // we create an connection handler and it give us to and fro interaction b/w the server/observer and the user/subscriber
    connectionHandler(){
        let self = this;

         // //Requesting for connecting socket to the chat server
        // on means detecting an event and event on socket takes place is connection, when connect event occurs then call the callback fn that socket has been connected  
         this.socket.on("connect" , function(){
            console.log("connection is established using sockets...!");

            //Emitting function for joining the chat room
            self.socket.emit("join_room" , {
                user_email : self.userEmail,
                chatroom : "codeial"
            });

            //Giving messages to all in that chat room that new user joined
            self.socket.on("user_joined" , function(data){
                console.log("A user joined" , data);
            });
        });

        //send a message on clicking the send message button
        $("#send-message").click(function(){
            let msg = $("#chat-message-input").val();

            if(msg != ""){
                self.socket.emit("send_message" ,{
                    message : msg,
                    user_email : self.userEmail,
                    chatRoom : "codeial"
                });
            } 
        });

        // here we recieve a msg
        self.socket.on("receive_msg" , function(data){
            console.log("Message Received", data.message);

            // here we use li it is in the chat_box.ejs file
            let newMessage = $("<li>");
            
            let messageType = "other-message";

            // in this we are checking the email, if the email is doesn't match then it remains the other message otherwise msg type becomes self-msg
            if(data.user_email != self.userEmail){
                messageType = "self-message";
            }

            // here in the span we had our msg
            newMessage.append($("<span>" , {
                "html" : data.message
            }));
            
            // sub means subscript and in html we see who has send the msg
            newMessage.append($("<sub>" , {
                "html" : data.user_email
            }));

            // newMessage.html(`<span>${data.message}</span>`)
            
            newMessage.addClass(messageType);

            $("#chat-messages-list").append(newMessage);
            // console.log(document.getElementById("chat-messages-list"));
        });
    }
}