
// 1. When the page loads
// 2. Creation of every post dynamically via AJAX

{
    // hmne yha postId isliye pass kiya bcoz hmne post ki id send krni h na comment dekhne k liye ki ye id h(post h) aur iska comment h ye
    var createComment = function(postId){
        // console.log('kiki',postId)

        // ye id comment-form post.ejs file m h and ye comment-form mara bs comment create kr rha h
        let newCommentForm = $(`#comment-form-${postId}`);
        // console.log(newCommentForm);

        // whwnever this form is submitted i don't wanted to submitted naturally or auto.So,we do preventDefault
        // here e is for the event
        newCommentForm.submit(function(e){
            e.preventDefault();
            console.log("Hey");
            // to dispaly comments without refreshing the page(ye krne se jb hm comment krege kuch to hmara page refresh ni hoga )
            // currentPostId = $(this).prop('id');
            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: newCommentForm.serialize(),
                success: function(data){
                    // I received the data and print the data in console
                    // console.log(newCommentForm.prop('id'));
                    // console.log('data',data.data);
                   
                    //// isme hm comment controller m dekhege request xhr m usme jaise likha hua h vaise hi likhege data.post vala
                    let newComment = newCommentDom(data.data.comment);
                    // console.log(newComment)
                    // ye post-comments hmara bhaut sare comment add kr rha h
                    $(`#post-comments-${postId}`).prepend(newComment);
                    // console.log($(`#post-comments-${postId}`))
                    
                    deleteComment($(' .delete-comment-button', newComment));
                    // console.log($(' .delete-comment-button', newComment));
                    // hm yha pr delete-comment-button se ple space dete h taki pta chle ki ye newComment ka object h

                    //  enable the functionalaties of the toggle like button in the new comment
                    new ToggleLike($(' .toggle-like-button', newComment));
                

                    new Noty({
                        theme:'relax',
                        text: 'Comment Created',
                        // we can change the color of this success to whatever we want just go though to the noty js
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();


                    
                    // request.flash('success', 'Comment created!');
                }, error: function(error){
                    console.log('error');
                    request.flash('error', 'Error!');
                    console.log(error.responseText);
                    // console.log(error);
                }
            });
        });
    }



 
    // METHOD TO CREATE A COMMENT IN DOM

    let newCommentDom = function(comment){
        return $(`<li id='comment-${comment._id}'>
                    <!-- <p> -->
                        
                            <small>
                                <a class="delete-comment-button" href="/comments/destroy/${ comment._id }">
                                    X
                                </a> &nbsp;
                            </small>
                
                        ${ comment.content }
                        <br><br>
                        <small>
                            <!-- isse hme user ka name aur email mil jyega jisne vo comment dala hua h -->
                            User:${ comment.user.name }
                            <br>
                            Email Id:${ comment.user.email }
                        </small>
                        
                        <!-- show the count of zero likes on this comment
                        This is the new comment so jb iske pas koi likes ni h tbhi hmne ise yha kiya-->
                        <small>

                            <a class ="toggle-like-button" data-likes = "0" href = "/likes/toggle/?id=${comment._id}&type=Comment">
                            0 Likes
                            </a>

                        </small>

                    <!-- </p> -->
                </li>`)
    }



    // METHOD TO DELETE THE COMMENT FROM DOM
        var deleteComment = function(deleteLink){
        // console.log('deleeyt called')
        
        // e is the event to be happen
        $(deleteLink).click(function(e){
            console.log('stopped natural behaviour');
            // console.log($(deleteLink).prop('href'))
            // we do here preventDefault bcoz I don't want a natural behavious to be here like clicking on the link and going somewhere
            e.preventDefault();
            $.ajax({
                type: 'get',
                // this is how we get the value of href in a tag
                url: $(deleteLink).prop('href'),
                success: function(data){
                    // console.log('hello, i am in delete ajax!');
                    // it will remove the comment & we did in comment.ejs file in li tag(hme jquery use krni thi isliye hmne back-tick use kiya & data.commentt_id isliye likja bcoz hmne assume kiya that we are getting the data which has the id of the comment jo hme delete krni h)
                    $(`#comment-${data.data.comment_id}`).remove();

                    new Noty({
                            theme:'relax',
                            text: 'Comment Deleted!',
                            // we can change the color of this success to whatever we want just go though to the noty js
                            type: 'success',
                            layout: 'topRight',
                            timeout: 1500
                        }).show();
                    // request.flash('success', 'Comment Destroyed!'); 
                }, error: function(error){
                    console.log('error', 'Error!');
                    console.log(console.log(error.responseText));
                }
            });
        });
    }
    

}

