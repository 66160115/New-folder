import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";  
import { successResponse, errorResponse } from "../utils/response.js";

export async function register(req,res){
    try{
        const {name, email,password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword,
            }
        });
        successResponse(res, "สมัครสมาชิกสำเร็จ", { id: newUser.id, name, email });
    }catch (error) {
        errorResponse(res, error.message, 400);
    }
}

export async function login(req, res) {
    try {
        const {email,password} = req.body;
        const user = await prisma.user.findFirst({
            where: {
                email: email,
            }
        })
        if (!user) throw new Error("ไม่พบผู้ใช้ในระบบ");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("รหัสผ่านไม่ถูกต้อง");

        const token = jwt.sign(
            { id: user.user_id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        successResponse(res, "เข้าสู่ระบบสำเร็จ", { token, name: user.name, email: user.email, role: user.role });
    }catch (error) {
        errorResponse(res, error.message, 400);
    }
}