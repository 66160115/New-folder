/**
 * คำอธิบาย: Template สำหรับ Response JSON มาตรฐาน
 */
export const successResponse = (res, message, data = null, status = 200) => {
  res.status(status).json({
    error: false,
    message,
    data,
  });
};

export const errorResponse = (res, message, status = 400) => {
  res.status(status).json({
    error: true,
    message,
  });
};
