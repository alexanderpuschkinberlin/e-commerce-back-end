const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

// get all products
router.get("/", async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const products = await Product.findAll({
      include: Category,
    });
    res.status(200).json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json("Error while retrieving the products data");
  }
});

// get one product
router.get("/:id", async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const products = await Product.findByPk(req.params.id, {
      include: [
        { model: Category, attributes: ["category_name"] },
        {
          model: Tag,
          through: ProductTag,
          attributes: ["tag_name"],
        },
      ],
    });
    res.status(200).json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json("Error while retrieving the products data");
  }
});

// create new product
router.post("/", async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  try {
    const product = await Product.create(req.body);

    // if there's product tags, we need to create pairings to bulk create in the ProductTag model
    if (req.body.tagIds && req.body.tagIds.length > 0) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      const productTagIds = await ProductTag.bulkCreate(productTagIdArr);
      res.status(200).json(productTagIds);
    } else {
      // if no product tags, just respond
      res.status(200).json(product);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// update product
router.put("/:id", async (req, res) => {
  try {
    // update product data
    const resultNumber = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (req.body.tagIds && req.body.tagIds.length > 0) {
      // find all associated tags from ProductTag
      const productTags = await ProductTag.findAll({
        where: { product_id: req.params.id },
      });

      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      const updatedProductTags = await Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
      res.status(200).json(updatedProductTags);
    } else {
      res.status(200).json(resultNumber);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  // delete one product by its `id` value
  try {
    const destroyProduct = await Product.destroy({
      where: {
        id: +req.params.id,
      },
    });
    res.status(200).json(destroyProduct);
  } catch (error) {
    console.log(err);
    res.status(500).json("Error while deleting product data in the DB");
  }
});

module.exports = router;
