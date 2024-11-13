const { getUser } = require("../service/auth");
/*
Authorization can be used by 2 ways cookies and headers
*/


// async function restrictToLoggedInUserOnly(req, res, next){
//     const userUid = req.cookies?.uid;

//     // if uid isn't available then redirect to login.
//     if(!userUid) return res.redirect('/login');
//     const user = await getUser(userUid);

//     // if uid is available then check is it the correct one and 
//     // if not again redirect to login page.
//     if(!user) return res.redirect('/login');

//     req.user = user;
//     next();
// }

// async function restrictToLoggedInUserOnly(req, res, next){
//     const userUid = req.headers["Authorization"];

//     // if uid isn't available then redirect to login.
//     if(!userUid) return res.redirect('/login');

//     const token = userUid.split('Bearer ')[1];

//     const user = await getUser(token);

//     // if uid is available then check is it the correct one and 
//     // if not again redirect to login page.
//     if(!user) return res.redirect('/login');

//     req.user = user;
//     next();
// }

/*
async function checkAuth(req, res, next){
    const userUid = req.cookies?.uid;
    
    if (!userUid) {
        req.user = null;
        return next();
    }

    const user = getUser(userUid);
    req.user = user;
    next();
}
*/

function checkForAuthentication(req, res, next){
    const tokenCookie = req.cookies?.token;
    req.user = null;

    if(!tokenCookie) return next();
    
    const token = tokenCookie;
    const user = getUser(token)

    req.user = user;
    return next();
}

function restrictTo(roles = []){
    return function(req, res, next) {
        if(!req.user) return res.redirect('/login');

        if(!roles.includes(req.user.role)) return res.end("Unauthorized");

        return next();
    }
}

module.exports = {
    checkForAuthentication,
    restrictTo,
}   