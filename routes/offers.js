const express = require("express");
const router = express.Router({ mergeParams: true });
const db = require("../db");

router.get("/", async (req, res, next) => {
  try {
    // Get the specific graduate based on the id in the URL
    const graduate = await db.query("SELECT * FROM graduates WHERE id=$1", [
      req.params.id
    ]);
    // Get all the offers where the graduate_id is the same as on the one in the URL
    const offers = await db.query(
      "SELECT id,title FROM offers WHERE graduate_id=$1",
      [req.params.id]
    );
    // set a property on graduate.rows[0] (which is the specific grad found) called offers
    // the value of the offers property will be an array of offers we get back from the 2nd query
    if( graduate.rows[0]!=null){
        graduate.rows[0].offers = offers.rows;
    return res.json(graduate.rows[0]);
    }
    else{
        next('no graduate found with id:'+req.params.id)
    }
  } catch (e) {
    return next(e);
  }
});

// Here we are just adding another route/endpoint to add an offer for a specific grad
router.post("/", async (req, res, next) => {
  try {
    const graduate = await db.query(
      "INSERT INTO offers ( title, graduate_id) VALUES ($1, $2)",
      [req.body.title, req.params.id]
    );
    // depending on what we want our API to respond with, we might need to make some additional queries, or we can just send back a simple message.
    return res.json({ message: "Created" });
  } catch (e) {
    return next(e);
  }
});

router
    .route("/:offerId")
    .get(async (req,res,next)=>{
        try{
            const offer=await db.query(
                "select id,title from offers where id=$1",[req.params.offerId]
            )
            if(offer.rows[0]!=null){
                res.json(offer.rows[0]);
            }
            else{
                return next('no offer found with id:'+req.params.offerId)
            }
        }
        catch(e){
            return next(e);
        }
    })
    .patch(async (req,res,next)=>{
        try {
            const result = await db.query(
              "UPDATE offers SET title=$1 WHERE id=$2 RETURNING *",
              [req.body.title, req.params.offerId]
            );
            return res.json(result.rows[0]);
          } catch (e) {
            return next(e);
          }
    })
    .delete(async (req,res,next)=>{
        try{
            const result= await db.query(
                "DELETE FROM offers WHERE id=$1 RETURNING *",[req.params.offerId]
            );
            return res.json(result.rows[0]);
        }
        catch(e){
            return next(e);
        }
    })

module.exports = router;