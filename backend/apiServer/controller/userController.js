const prisma=require('../../lib/prisma')
const fs = require("fs");
const path = require("path");

module.exports={
    setProfilePic: async (req,res)=>{
        try {
            if(!req.file){
                return res.status(400).json({error:"No image uploaded"});
            }
            const userId=req.user;
            const finalFilename=`user_${userId}.webp`
            const finalPath=path.join('uploads/profilePics',finalFilename);
            const imageUrl=`/static/profilePics/${finalFilename}`

            fs.mkdirSync(path.dirname(finalPath),{recursive:true})
            fs.renameSync(req.file.path,finalPath);
            const result=await prisma.user.update({
                where:{id:userId},
                data:{
                    profileUrl:imageUrl
                }
            })
            return res.status(200).json({
                profilePic:imageUrl
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({error:"Upload Failed"})
        }
    },
    deleteProfilePic:async (req,res)=>{
        try {
            const userId=req.user;
            const finalFilename=`user_${userId}.webp`
            const filePath=path.join('uploads/profilePics',finalFilename)

            if(fs.existsSync(filePath)){
                fs.unlinkSync(filePath)
            }

            await prisma.user.update({
                where:{id:userId},
                data:{profileUrl:null}
            })
            return res.status(200).json({message:"Profile photo deleted"})
            
        } catch (error) {
            res.status(500).json({error:"Delete failed"})
        }
    },
    getProfileUrl:async (req,res)=>{
        const {id}=req.params
        const url=await prisma.user.findUnique({
            where:{id:parseInt(id)},
            select:{
                profileUrl:true
            }
        })
        res.status(200).json(url)
    }
}