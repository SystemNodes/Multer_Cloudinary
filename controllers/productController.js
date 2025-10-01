const productModel = require('../models/productModel');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

exports.addProduct = async (req, res) => {
    try {
        const {productName, description, price} = req.body;
        const files = req.filePaths;

        const imageDetails = [];

        for (const image of files){
            const result = await cloudinary.uploader.upload(image.path, {
                folder: "Multer_Cloudinary/product"
            });

            const fileInfo = {
                url: result.secure_url,
                publicId: result.public_id
            }
            imageDetails.push(fileInfo);
            fs.unlinkSync(image.path)
        }

        const product = new productModel({
            productName, 
            description, 
            price,
            images: imageDetails
        });

        await product.save();

        res.status(201).json({
            message: "Product added successfully",
            data: product
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.oneProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const product = await productModel.findById(id);

        if(!product){
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product found",
            data: product
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.allProducts = async (req, res) => {
    try{
        const product = await productModel.find();

        res.status(200).json({
            message: `${product.length} product(s) found`,
            data: product
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const product = await productModel.findByIdAndDelete(id);

        if(!product){
            return res.status(404).json({
                message: "Product not found!"
            });
        }

        await cloudinary.uploader.destroy(user.images.publicId);

        res.status(200).json({
            message: "Product deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

// 1. Addind new product images, while retaining the others
exports.addProductImages = async (req, res) => {
    const file = req.file;

    try {
        const {id} = req.params;
        const product = await productModel.findById(id);

        if (!product) {
            return res.status(400).json({
                message: "Product not found"
            });
        }

        const uploadResult = cloudinary.uploader.upload(file.path, {
            folder: "Multer_Cloudinary/product"
        });

        fs.unlink(file.path, (error)=>{
            console.log("Error deleting file", error);
        });

        const newImage = {
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id
        };

        product.images.push(newImage);
        await product.save();

        res.status(200).json({
            message: "Images added successfully",
            images: product.images
        });

    } catch (error){
        if (file && file.path) {
            fs.unlink(file.path, (error) => {
                console.log("Error deleting local file", error);
            });
        }

        res.status(500).json({
            error: error.message
        });
    }
};

// 2. Replace a particular image in the product images, while retaining other
exports.replaceProductImage = async (req, res) => {
    const file = req.file;

    try {
        const {id, imageId} = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ 
                message: "Product not found!" 
            });
        }

        const image = product.images.find(img => img.publicId === imageId);

        await cloudinary.uploader.destroy(image.publicId);

        const uploadResult = await cloudinary.uploader.upload(file.path, {
            folder: "Multer_Cloudinary/producty"
        });

        fs.unlink(file.path, () => {});

        image.url = uploadResult.secure_url;
        image.publicId = uploadResult.public_id;

        await product.save();

        res.status(200).json({
            message: "Image replaced successfully",
            images: product.images
        });
        
    } catch (error) {
        if (file && file.path) {
            fs.unlink(file.path, (error)=>{
            console.log("Error deleteing local file", error);
            });
        }

        res.status(500).json({
            error: error.message
        });
    }
};

// 3. Replace multiple images, while retaining the ones not specified
exports.replaceMultipleImages = async (req, res) => {
    const files = req.files;

    try {
        const {id} = req.params;
        const checkIds = req.body.imageIds
        const imageIds = Array.isArray(checkIds) ? checkIds : [checkIds];

        const product = await productModel.findById(id);
        if (!product) {
            return res.status(400).json({
                message: "Product nor found"
            });
        }
        if (!files || files.length === 0 || imageId.length === 0) {
            return res.status(400).json({
                message: "Please provide images"
            });
        }

        for (const [i, file] of files.entries()) {
            const imageId = imageIds[i];

            const existingImage = product.images.find(img=>img.publicId===imageId);

            await cloudinary.uploader.destroy(existingImage.publicId);

            const uploadResult = await cloudinary.uploader.upload(file.path, {
                folder: "Multer_Cloudinary/products"
            });

            fs.unlink(file.path, () => {});

            existingImage.url = uploadResult.secure_url;
            existingImage.publicId = uploadResult.public_id;
        }

        await product.save();

        res.status(200).json({
            message: "Image replaced successfully",
            images: product.images
        });

    } catch (error) {
        if (file && file.path) {
            fs.unlink(file.path, (error)=>{
                console.log("Error deleteing local file", error);
            });
        }
        
        res.status(500).json({
            error: error.message
        }); 
    }

};
