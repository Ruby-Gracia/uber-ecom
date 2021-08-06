const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/productModel");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.get("/", (req, res, next) => {
  Product.find()
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            description: doc.description,
            rating: doc.rating,
            productImage: doc.productImage,
            _id: doc._id,
          };
        }),
      };
      //   if (docs.length >= 0) {
      res.status(200).json(response);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/newproduct", upload.single("productImage"), async (req, res) => {
  console.log(req.file);
  const product = await new Product({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    rating: req.body.rating,
    productImage: req.file.path,
  });
  product.save().then((result) => {
    res.status(200).json({
      success: true,
      data: result,
    });
  });
});

module.exports = router;
