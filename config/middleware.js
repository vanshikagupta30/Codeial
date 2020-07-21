
// we setup sme msgs to user controller & to pass these msgs to the HTML or ejs template we created a middleware which fetches everything from the request flash and put it into locals(locals is a global variable)
// we need to be able to give flash msgs to request and what we are sending back is the response So the flash msg need to be transform in response
// ye hmne yha isliye likha bcoz agr hm ise passport file m likh dete to hme is code/middleware ko hr jagah likhna pdta ab hm is middleware ka refrence lekr krte rahege
module.exports.setFlash = function(request, response, next){
    // locals ia a global variable isliye hmne locals ko views file m bhi use kiya h
    response.locals.flash = {
        'success' : request.flash('success'),
        'error' : request.flash('error')
    } 
    next();
}