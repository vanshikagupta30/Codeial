// // create a class to toggle likes when a link is clicked, using AJAX

// // toggle like is a class which is created and it handles ajax request which is used to claa that route for increment or decrement the like count on the post or a comment
// function toggleLike(toggleBtn){
//     // console.log(toggleBtn);
//     $(toggleBtn).click(function(event){
//         event.preventDefault();
//         // this is a new way of writing ajax which you might've studied, it looks like the same as promises
//         $.ajax({
//             type : "GET",
//             url : $(toggleBtn).attr("href"),
//             success : function(data){
//                 let likesCount = $(toggleBtn).attr("data-likes");
//                 console.log(likesCount);
//                 console.log(data);
//                 if(data.deleted){
//                     likesCount--;
//                     // console.log(likesCount);
//                     // here deleted true means -1
//                 }else{
//                     likesCount++;
//                     // here deleted false means +1
//                 }
                
//                 $(toggleBtn).attr("data-likes" , likesCount);
//                 $(toggleBtn).html(`${likesCount} Likes`)
//             },
//             error : function(error){
//                 console.log(error.responseText);
//             }           
//             });
//        });
//     }   

//     // $('.toggle-btn').each(function(){
//     //     toggleLike($(this));
//     // });


// CHANGE :: create a class to toggle likes when a link is clicked, using AJAX
class ToggleLike{
    constructor(toggleElement){
        this.toggler = toggleElement;
        this.toggleLike();
    }


    toggleLike(){
        $(this.toggler).click(function(e){
            e.preventDefault();
            let self = this;

            // this is a new way of writing ajax which you might've studied, it looks like the same as promises
            $.ajax({
                type: 'POST',
                url: $(self).attr('href'),
            })
            .done(function(data) {
                let likesCount = parseInt($(self).attr('data-likes'));
                console.log(likesCount);
                if (data.data.deleted == true){
                    likesCount -= 1;
                    
                }else{
                    likesCount += 1;
                }


                $(self).attr('data-likes', likesCount);
                $(self).html(`${likesCount} Likes`);

            })
            .fail(function(errData) {
                console.log('error in completing the request');
            });
            

        });
    }
}
