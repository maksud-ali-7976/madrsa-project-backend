import QRCode from 'qrcode'

export const generateQR = async (payload: any) => {
    return await QRCode.toBuffer(JSON.stringify(payload), { scale: 8 });
};
