function checkAdmin (req,res,next){
  if (req.user && req.user.role === "admin") next();
  else res.redirect("/");
}

function checkUser (req,res,next){
  if (req.user) next();
  else res.redirect("/");
}


module.exports = {checkAdmin, checkUser};
