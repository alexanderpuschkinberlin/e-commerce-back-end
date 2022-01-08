const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

router.get("/", async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categories = await Category.findAll({
      include: [
        {
          model: Product,
          attributes: ["product_name"],
        },
      ],
    });
    res.status(200).json(categories);
  } catch (err) {
    console.log(err);
    res.status(500).json("Error while retrieving data from DB");
  }
});

router.get("/:id", async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          attributes: ["product_name"],
        },
      ],
    });
    res.status(200).json(category);
  } catch (err) {
    console.log(err);
    res.status(500).json("Error while retrieving data from DB");
  }
});

router.post("/", async (req, res) => {
  // create a new category
  try {
    const newCategory = await Category.create(req.body);
    res.status(200).json(newCategory);
  } catch (error) {}
});

router.put("/:id", (req, res) => {
  // update a category by its `id` value
  try {
    const updateCategory = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(updateCategory);
  } catch (error) {
    console.log(err);
    res.status(500).json("Error while updating category data in the DB");
  }
});

router.delete("/:id", async (req, res) => {
  // delete a category by its `id` value
  try {
    const destroyCategory = await Category.destroy({
      where: {
        id: +req.params.id,
      },
    });
    res.status(200).json(destroyCategory);
  } catch (error) {
    console.log(err);
    res.status(500).json("Error while deleting category data in the DB");
  }
});

module.exports = router;
