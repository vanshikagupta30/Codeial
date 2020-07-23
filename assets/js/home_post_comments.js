{
    var createComment = function(postId){
        let newCommentForm = $(`#comment-form-${postId}`);
        newCommentForm.submit(function(e){
            e.preventDefault();
            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: newCommentForm.serialize(),
                success: function(data){
                    let newComment = newCommentDom(data.data.comment);
                    $(`#post-comments-${postId}`).prepend(newComment);
                    deleteComment($(' .delete-comment-button', newComment));
                    new ToggleLike($(' .toggle-like-button', newComment));
                

                    new Noty({
                        theme:'relax',
                        text: 'Comment Created',
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();


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
        
        $(deleteLink).click(function(e){
            console.log('stopped natural behaviour');
            // console.log($(deleteLink).prop('href'))
            e.preventDefault();
            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    // console.log('hello, i am in delete ajax!');
                    $(`#comment-${data.data.comment_id}`).remove();

                    new Noty({
                            theme:'relax',
                            text: 'Comment Deleted!',
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

