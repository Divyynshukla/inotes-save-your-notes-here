const jwt = require("jsonwebtoken");

const JWT_SECRET = "divyynshukla";

const fetchuser = (req,res,next) =>
{
        const token = req.header('auth-Token');
        if(!token)
        {
          return  res.status(401).send({error : "access denied"});
        }

        try {
            const data = jwt.verify(token,JWT_SECRET);
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({error : "authentication error"});
        }
      

   

}




module.exports = fetchuser;