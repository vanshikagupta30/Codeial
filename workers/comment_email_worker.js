// here we use kue that's why we require here 
const queue = require('../config/kue');

// in comment_controller we call a commentsMailer, hm ye yha isliye add kr rahe h bcoa agr hme 1000 comments add krne h to vo kue worker m hoge
const commentsMailer = require('../mailers/comments_mailer');

///// we create a worker which is going to send those emails for us insted of a senting it via controller

// now every worker has a process fn and this fn will do,it tells the worker whenever a new task is added in the queue we need to run the code inside this process fn
// in the process emails are there and in the cb fn 1st argu is job i.e. what it needs to do and 'data' which is comment, the comment is which I am filling in the email
queue.process('email', function(job, done){
    // job.data is who is the comment has been send(jisne comment send kiya h)
    console.log('Emails Worker is processing a job', job.data);

    commentsMailer.newComment(job.data);

    done();

});