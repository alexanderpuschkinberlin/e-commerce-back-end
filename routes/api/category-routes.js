const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

router.get("/", async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try{
  const categories = await Category.findAll();
  res.status(200).json(categories);
  } catch(err){
    console.log(err);
    res.status(500).json("Error while retrieving data from DB");
  }
});


router.get("/:id", async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try{
    const categories = await Category.findByPK(req.params.id);
    res.status(200).json(categories);
    } catch(err){
      console.log(err);
      res.status(500).json("Error while retrieving data from DB");
    }
});

router.post("/", (req, res) => {
  // create a new category
});

router.put("/:id", (req, res) => {
  // update a category by its `id` value
});

router.delete("/:id", (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
