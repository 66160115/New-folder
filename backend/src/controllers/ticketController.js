import prisma from "../config/prisma.js";
import { successResponse, errorResponse } from "../utils/response.js";

export async function createTicket(req,res){
    try {
        const {title, description, type, urgency,status} = req.body;
        const submittedById = req.user.id;
        const file = req.file;

        const newTicket = await prisma.ticket.create({
            data : {
                title,
                description,
                type,
                urgency,
                status,
                submittedById
            }
        });

        if (file) {
            await prisma.attachment.create({
                data: {
                    filePath: "/uploads/" + file.filename,
                    fileType: file.mimetype,
                    ticketId: newTicket.id,   
                    userId: submittedById
                }
            });
        }

        await prisma.notification.create({
            data : {
                message: `ตั๋วใหม่ถูกสร้างขึ้น: ${newTicket.title}`,
                ticketId: newTicket.id,
                userId: submittedById
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
        if(role.toLowerCase() === "staff"){
            const ticket = await prisma.ticket.findUnique({
                where: { id: parseInt(ticketId) },
                include: {
                    attachments: true,
                    comments: true
                }
            })
            if (!ticket) return errorResponse(res, "ไม่พบตั๋วที่ระบุ", 404);
            return successResponse(res, "ดึงตั๋วสำเร็จ", ticket);
        }
        const ticket = await prisma.ticket.findUnique({
            where: { id: parseInt(ticketId) , submittedById: id },
            include: {
                attachments: true,
                comments: true
            }
        })
        if (!ticket) return errorResponse(res, "ไม่พบตั๋วที่ระบุ", 404);
        successResponse(res, "ดึงตั๋วสำเร็จ", ticket);
    } catch (error) {
        errorResponse(res, error.message, 400);
    }
    
}

export async function getAllTickets(req,res){       
    try {
        const tickets = await prisma.ticket.findMany()
        successResponse(res, "ดึงตั๋วทั้งหมดสำเร็จ", tickets);
    }catch (error) {
        errorResponse(res, error.message, 400);
    }
}

export async function createComment(req,res){
    try{
        const {body} = req.body;
        const {ticketId} = req.params;
        const userId = req.user.id;
        const newComment = await prisma.comment.create({
            data : {
                body,
                authorId: userId,
                ticketId: parseInt(ticketId)
            }
        })
        successResponse(res, "สร้างคอมเมนต์สำเร็จ", newComment);
    }catch (error) {
        errorResponse(res, error.message, 400);
    }
}

export async function updateStatus(req, res) {
  try {
    const { status } = req.body;
    const { ticketId } = req.params;

    // 1) validate input
    if (!status) return errorResponse(res, "ต้องระบุสถานะใหม่", 400);

    // 2) Ensure ticket exists
    const oldTicket = await prisma.ticket.findUnique({
      where: { id: parseInt(ticketId) }
    });

    if (!oldTicket) return errorResponse(res, "ไม่พบตั๋วที่ระบุ", 404);

    // 3) ensure req.user.id exists
    if (!req.user || !req.user.id) {
      return errorResponse(res, "Unauthorized: ไม่พบข้อมูลผู้ใช้ใน token", 401);
    }

    // 4) อัปเดตสถานะตั๋ว
    const updatedTicket = await prisma.ticket.update({
      where: { id: parseInt(ticketId) },
      data: { status }
    });

    // 5) บันทึกประวัติ
    await prisma.statusHistory.create({
      data: {
        oldStatus: oldTicket.status,
        newStatus: status,
        changedAt: new Date(),
        ticketId: parseInt(ticketId),
        userId: req.user.id
      }
    });
    successResponse(res, "อัปเดตสถานะตั๋วสำเร็จ", updatedTicket);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
}
