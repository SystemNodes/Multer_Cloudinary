const userModel = require('../models/userModel');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

exports.createUser = async (req, res) => {
    const file = req.file;

    try {
        const {fullName, email, gender} = req.body;

        const userExist = await userModel.findOne({email: email.toLowerCase()});
        if (userExist){
            return res.status(400).json({
                message: 'User already registered'
            });
        }

        // Uploading the file to cloudinary
        const uploadResult = await cloudinary.uploader.upload(file.path, {
            folder: "Multer_Cloudinary/user"
        });

        // Delete the local file after uploading to Cloudinary
        fs.unlink(file.path, (error) => {
            if (error) console.log("Error deleting file", error);
        });

        const image = {
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id
        }
        
        const user = new userModel({
            fullName,
            email: email.toLowerCase(),
            gender,
            profilePicture: image
        });

        await user.save();

        res.status(201).json({
            message: "User registered successfully",
            data: user
        });

    } catch (error) {
        if (file && file.path) {
            fs.unlink(file.path, (error) => {
                if(error) console.log("Error deleting local file", error);
            });
        }

        res.status(500).json({
            error: error.message
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await userModel.findByIdAndDelete(id);

        if(!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        await cloudinary.uploader.destroy(user.profilePicture.publicId);

        res.status(200).json({
            message: "User deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.allUser = async (req, res) => {
    try {
        const users = await userModel.find();

        res.status(200).json({
            message: `All users totalled: ${users.length}`,
            data: users
        });
        
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.oneUser = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await userModel.findById(id);

        if (!user){
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: `user was Found`,
            data: user
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

// Update