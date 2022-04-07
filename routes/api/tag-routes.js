const router = require("express").Router();
const { response } = require("express");
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

router.get("/", async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tags = await Tag.findAll({
      include: [
        {
          model: Product,
          attributes: ["product_name", "id"],
        },
      ],
    });
    res.status(200).json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json("Error while retrieving data from DB");
  }
});

router.get("/:id", async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          attributes: ["product_name"],
        },
      ],
    });
    res.status(200).json(tag);
  } catch (err) {
    console.log(err);
    res.status(500).json("Error while retrieving data from DB");
  }
});

router.post("/", async (req, res) => {
  // create a new tag
  try {
    const newTag = await Tag.create(req.body);
    res.status(200).json(newTag);
  } catch (error) {
    console.log("Error", error);
    res.status(500).json(error);
  }
});

router.put("/:id", async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const updateTag = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(updateTag);
  } catch (error) {
    console.log(err);
    res.status(500).json("Error while updating category data in the DB");
  }
});

router.delete("/:id", async (req, res) => {
  // delete on tag by its `id` value
  try {
    const resultNumber = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(resultNumber);
  } catch (error) {
    console.log("Error", error);
    res.status(500).json(error);
  }
});

module.exports = router;
