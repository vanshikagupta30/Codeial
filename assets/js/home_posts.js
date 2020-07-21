//..we create this js file which fetches the data form, sends in json format to the action. Whenever I submiting the form to create a new
//..posts it should not get submitted automatically,it would be submitted via JQUERY/AJAX

{
    //.. METHOD TO SUBMITING THE FORM DATA FOR NEW POST USING AJAX
    // console.log('hello');
    // hme 2 chiz chaiye posts ko bnane k liye one is sends the data to the controller action and second is function which receives the data of created post & displays it over the home page
    let createPost = function(){
        // ye id new-post-form home.ejs file m h
        let newPostForm = $('#new-post-form');

        // whwnever this form is submitted i don't wanted to submitted naturally or auto.So,we do preventDefault
        // here e is for the event
        newPostForm.submit(function(e){
            e.preventDefault();

            //ajax is used to dispaly posts without refreshing the page(ye krne se jb hm post krege kuch to hmara page refresh ni hoga )
            $.ajax({
    // isme plhe hme type diya ki kisko krna h then kis URL pr krna h then data use serialize(encripted form m jise sare dekh skte h) krke send krega 
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function(data){
                // I received the data and print the data in console
                    // console.log(data);
                    //// isme hm post controller m dekhege request xhr m usme jaise likha hua h vaise hi likhege data.post vala
                    let newPost = newPostDom(data.data.post);
                    // let newPost = newPostDom(data.post);
                    // > means in id ki post-list-container k andr ul tag and in home.ejs post-list-container id is already there isliye hmne usme prepend kiya aur in this prepend means putting on the 1st position in the array or posts
                    $('#posts-list-container>ul').prepend(newPost);
                    // console.table(data.data.post)

                    // to delete the post ye newPost hmari line no 27 m h(delete post inside the function newPost and this class is in the post.ejs file)
                    deletePost($(' .delete-post-button', newPost));

                    // enable the functionality of the toggle like button on the new post
                    new ToggleLike($(' .toggle-like-button', newPost));
                    
                    createComment(data.data.post._id);

                    new Noty({
                        theme:'relax',
                        text: 'Post Created',
                        // we can change the color of this success to whatever we want just go though to the noty js
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

    // here we said deleteLink bcoz I pass on the a tag which is n post.ejs file which will delete the post in line no 7 & stimulate a click on this
    let deletePost = function(deleteLink){
        // e is the event to be happen
        $(deleteLink).click(function(e){
            // we do here preventDefault bcoz I don't want a natural behavious to be here like clicking on the link and going somewhere
            e.preventDefault();
            
            $.ajax({
                type: 'get',
                // this is how we get the value of href in a tag
                url: $(deleteLink).prop('href'),
                success: function(data){
                    // console.log("Hey");
                    
                    // it will remove the post & we did in post.ejs file in li tag(hme jquery use krni thi isliye hmne back-tick use kiya & data.post_id isliye likja bcoz hmne assume kiya that we are getting the data which has the id of the post jo hme delete krni h)
                    $(`#post-${data.data.post_id}`).remove();
                    // $(`#post-${data.post._id}`).remove();
                    new Noty({
                        theme:'relax',
                        text: 'Post Deleted!',
                        // we can change the color of this success to whatever we want just go though to the noty js
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

        // .each ka mtlb ki jo function jo already bne hue h vo change ho jyega
        $('#posts-list-container>ul>li').each(function(){
            let self = $(this);
            //$this me us li ka context saved h jaise pehle itaeration me pehla li hoga this me dusre iteration me this me dusra li hoga
            let deleteButton = $(' .delete-post-button', self);

            // yaha us li ke andar jo delete post button name ki class hai uspe deleet psot call kiya h
            deletePost(deleteButton);

            // ye humare comment ka code h ..taki jo already presetn comment box h unpe bhi work kre ajax


            // get the post's id by splitting the id attribute(Self.prop('id) mtlab jo current post h uski id Yani ki post-<%=post._id%> jo post.ejs m li tag k andr h, Split('-') '-' iske according break krke array banata h(Yaani ki array bnega post) )
            let postId = self.prop('id').split("-")[1]; // [post-, <%= post._id %>], [1] postid return krdeta h
            createComment(postId);

        });
        // ye delete-comment-button comment.ejs file k andr h hme a tag k andr class di hui h vo comment delete krta h 
            $('.delete-comment-button').each(function(){
                // isme hmne self ki id di h bcoz jo post create hua h 
                let self = $(this);
                deleteComment(self);
            });

    }
    
    convertAllYourPostForAjax();
    createPost();


}