{
    let createPost = function(){
        let newPostForm = $('#new-post-form');
        newPostForm.submit(function(e){
            e.preventDefault();
            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function(data){
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    // console.table(data.data.post)

                    deletePost($(' .delete-post-button', newPost));

                    new ToggleLike($(' .toggle-like-button', newPost));
                    
                    createComment(data.data.post._id);

                    new Noty({
                        theme:'relax',
                        text: 'Post Created',
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();
                    
                }, error: function(error){
                    request.flash('error', 'Error!');
                    console.log(error.responseText);
                    // console.log(error);
                }
            });
        });
    }


    // METHOD TO CREATE A POST IN DOM
    let newPostDom = function(post){
        return $(`<li id="post-${post._id}">
                    <p>
                            <small>
                                <a class="delete-post-button" href="/posts/destroy/${ post._id }">
                                    X
                                </a> &nbsp;
                            </small>

                        ${ post.content }
                        <br>
                        
                        <small>
                        
                            <p>${ post.user.name }</p>
                            Email Id:${ post.user.email }
                        </small>
                        <br>
                        <!-- show the count of zero likes on this post
                        This is the new post so iske pas koi likes ni h tbhi hmne ise yha zero kiya -->
                        <small>

                            <a class ="toggle-like-button" data-likes = "0" href = "/likes/toggle/?id=${post._id}&type=Post">
                            0 Likes
                            </a>

                        </small>

                    </p>
                
                
                <!---------- in this we create a comment section ----------->
                    <div class="post-comment">
                    
                
                            <form action="/comments/create" class="new-comment-form" method="POST" id="comment-form-${post._id}">
                                
                                <!-- id of the posts in which comment should be added that is which we need to send -->
                                <input type="hidden" name="post" value="${ post._id }">
                                <input type="text" name="content" placeholder="Type Here To Add Comment..." required>
                                <input type="submit" value="Add Comment">
                            </form>
                
                
                <!--------$$------- in this we will show the comments nesting vale ---------$$--------->
                        <div class="post-comments-list">
                            <ul id="post-comments-${ post._id }">
                                
                            </ul>
                        </div>
                    </div>
                </li>`)
    }


    // METHOD TO DELETE THE POST FROM DOM

    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();
            
            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    // console.log("Hey");
                    $(`#post-${data.data.post_id}`).remove();
                    // $(`#post-${data.post._id}`).remove();
                    new Noty({
                        theme:'relax',
                        text: 'Post Deleted!',
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();
                    
                }, error: function(error){
                    request.flash('error', ' Error!');
                    console.log(error.responseText);
                }
            });
        });
    }


    // Delete post on page by jQuery

    let convertAllYourPostForAjax = function(){
        $('#posts-list-container>ul>li').each(function(){
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);

            deletePost(deleteButton);


            let postId = self.prop('id').split("-")[1]; 
            // createComment(postId);

        });
            $('.delete-comment-button').each(function(){
                let self = $(this);
                deleteComment(self);
            });
    }
    convertAllYourPostForAjax();
    createPost();
}