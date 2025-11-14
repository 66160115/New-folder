import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";  
import { successResponse, errorResponse } from "../utils/response.js";

export async function register(req,res){
    try{
        const {name, email,role,phone,password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                name: name,
                email: email,
                phone: phone,
                role: role.toUpperCase(),
                password: hashedPassword,
            }
        });
        successResponse(res, "สมัครสมาชิกสำเร็จ", { id: newUser.id, email, role });
    }catch (error) {
        errorResponse(res, error.message, 400);
    }
}

export async function login(req, res) {
    try {
        const {email,password} = req.body;
        const ip = req.ip;
        const user = await prisma.user.findFirst({
            where: {
                email: email,
            }
        })
        if (!user) throw new Error("ไม่พบผู้ใช้ในระบบ");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("รหัสผ่านไม่ถูกต้อง");

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        await prisma.loginHistory.create({
            data: {
                loginTime: new Date(),
                ipAddress: ip,
                userId: user.id
            }
        })
        successResponse(res, "เข้าสู่ระบบสำเร็จ", { token, email: user.email, role: user.role });
    }catch (error) {
        errorResponse(res, error.message, 400);
    }
}