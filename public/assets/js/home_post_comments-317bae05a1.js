{var createComment=function(t){let n=$("#comment-form-"+t);n.submit((function(o){o.preventDefault(),console.log("Hey"),$.ajax({type:"post",url:"/comments/create",data:n.serialize(),success:function(n){let o=e(n.data.comment);$("#post-comments-"+t).prepend(o),deleteComment($(" .delete-comment-button",o)),new ToggleLike($(" .toggle-like-button",o)),new Noty({theme:"relax",text:"Comment Created",type:"success",layout:"topRight",timeout:1500}).show()},error:function(e){console.log("error"),request.flash("error","Error!"),console.log(e.responseText)}})}))};let e=function(e){return $(`<li id='comment-${e._id}'>\n                    \x3c!-- <p> --\x3e\n                        \n                            <small>\n                                <a class="delete-comment-button" href="/comments/destroy/${e._id}">\n                                    X\n                                </a> &nbsp;\n                            </small>\n                \n                        ${e.content}\n                        <br><br>\n                        <small>\n                            \x3c!-- isse hme user ka name aur email mil jyega jisne vo comment dala hua h --\x3e\n                            User:${e.user.name}\n                            <br>\n                            Email Id:${e.user.email}\n                        </small>\n                        \n                        \x3c!-- show the count of zero likes on this comment\n                        This is the new comment so jb iske pas koi likes ni h tbhi hmne ise yha kiya--\x3e\n                        <small>\n\n                            <a class ="toggle-like-button" data-likes = "0" href = "/likes/toggle/?id=${e._id}&type=Comment">\n                            0 Likes\n                            </a>\n\n                        </small>\n\n                    \x3c!-- </p> --\x3e\n                </li>`)};var deleteComment=function(e){$(e).click((function(t){console.log("stopped natural behaviour"),t.preventDefault(),$.ajax({type:"get",url:$(e).prop("href"),success:function(e){$("#comment-"+e.data.comment_id).remove(),new Noty({theme:"relax",text:"Comment Deleted!",type:"success",layout:"topRight",timeout:1500}).show()},error:function(e){console.log("error","Error!"),console.log(console.log(e.responseText))}})}))}}