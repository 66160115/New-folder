import prisma from "../config/prisma.js";
import { successResponse, errorResponse } from "../utils/response.js";

export async function createTicket(req,res){
    try {
        const {title, description, type, urgency} = req.body;
        const userId = req.user.id;
        const file = req.file;

        const newTicket = await prisma.ticket.create({
            data : {
                title,
                description,
                type,
                urgency,
                userId
            }
        });

        if (file) {
            await prisma.attachment.create({
                data: {
                    filePath: "/uploads/" + file.filename,
                    fileType: file.mimetype,
                    ticketId: newTicket.id,   
                    userId
                }
            });
        }

        await prisma.notification.create({
            data : {
                message: `ตั๋วใหม่ถูกสร้างขึ้น: ${newTicket.title}`,
                ticketId: newTicket.id,
                userId: userId
            }
        })
        successResponse(res, "สร้างตั๋วสำเร็จ", newTicket);

    } catch (error) {
        errorResponse(res, error.message, 400);
    }
}

export async function getTicketById(req,res){
    try {       
        const {ticketId} = req.params;
        const {role,id} = req.user;
        if(role.toLowerCase() === "admin" || role.toLowerCase() === "staff"){
            const ticket = await prisma.ticket.findUnique({
                where: { id: parseInt(ticketId) },
                include: {
                    attachments: true
                }
            })
            if (!ticket) return errorResponse(res, "ไม่พบตั๋วที่ระบุ", 404);
            return successResponse(res, "ดึงตั๋วสำเร็จ", ticket);
        }
        const ticket = await prisma.ticket.findUnique({
            where: { id: parseInt(ticketId) , userId: id },
            include: {
                attachments: true
            }
        })
        if (!ticket) return errorResponse(res, "ไม่พบตั๋วที่ระบุ", 404);
        successResponse(res, "ดึงตั๋วสำเร็จ", ticket);
    } catch (error) {
        errorResponse(res, error.message, 400);
    }
    
}
