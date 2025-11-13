import prisma from "../config/prisma.js";
import { successResponse, errorResponse } from "../utils/response.js";

export async function editUser(req,res){
    try {
        const{name, email, phone} = req.body;
        const userId = req.params.userId;
        const user = await prisma.user.update({
            where: { id: parseInt(userId) },
            data:{
                name: name,
                email: email,
                phone: phone,
            }
        })
        await prisma.activityLog.create({
            data : {
                action: `แก้ไขข้อมูลผู้ใช้ ID: ${userId}`,
                userId: req.user.id,
                logTime: new Date(),
            }
        })
        successResponse(res, "แก้ไขข้อมูลผู้ใช้สำเร็จ", user);
    }catch (error) {
        errorResponse(res, error.message, 500);
    }
}

export async function getUserById(req,res){
    try {
        const {userId} = req.params;
        const user = await prisma.user.findFirst({
            where: { id: parseInt(userId) },
            select: {
                name:true,
                email:true,
                phone:true,
            }
        })
        if (!user) return errorResponse(res, "ไม่พบผู้ใช้ที่ระบุ", 404);
        successResponse(res, "ดึงข้อมูลผู้ใช้สำเร็จ", user);
    }catch (error) {
        errorResponse(res, error.message, 500);
    }
}

export async function deleteUser(req,res){
    try{
        const {userId} = req.params;
        const user = await prisma.user.findFirst({
            where:{ id: parseInt(userId) }
        })
        if (!user) return errorResponse(res, "ไม่พบผู้ใช้ที่ระบุ", 404);
        await prisma.user.delete({
            where: {
                id: parseInt(userId)
            }
        })
        await prisma.activityLog.create({
            data : {
                action: `ลบข้อมูลผู้ใช้ ID: ${userId}`,
                userId: req.user.id,
                logTime: new Date(),
            }
        })
        successResponse(res, "ลบผู้ใช้สำเร็จ");
    }catch (error) {
        errorResponse(res, error.message, 500);
    }
}