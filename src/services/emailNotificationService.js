import emailjs from '@emailjs/browser';
import { formatDH } from '../utils/priceUtils';

export const sendReservationSuccessEmail = async (reservationData) => {
  console.log("[EMAIL] Starting reservation email send...");
  console.log("[EMAIL] Service ID:", import.meta.env.VITE_EMAILJS_SERVICE_ID);
  console.log("[EMAIL] Template ID:", import.meta.env.VITE_EMAILJS_TEMPLATE_ID);
  console.log("[EMAIL] Public Key exists:", !!import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.error("[EMAIL] Missing EmailJS environment variables");
    alert("Email configuration missing. Check .env EmailJS keys.");
    return;
  }

  const templateParams = {
    to_email: 'elghiouanesouhail19@gmail.com',
    message: 'Reservation added successfully',
    client_name: reservationData.clientName || 'N/A',
    client_email: reservationData.clientEmail || 'N/A',
    client_phone: reservationData.clientPhone || 'N/A',
    room_name: reservationData.roomName || 'Unknown Room',
    check_in: new Date(reservationData.dateDebut).toLocaleDateString(),
    check_out: new Date(reservationData.dateFin).toLocaleDateString(),
    nights: reservationData.nights || 1,
    total_amount: formatDH(reservationData.totalPrice || reservationData.prixTotal),
    status: 'Paid'
  };

  console.log("[EMAIL] Template params:", templateParams);

  try {
    const result = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      publicKey
    );
    console.log("[EMAIL] Email sent successfully:", result);
    alert("Reservation email sent successfully.");
  } catch (error) {
    console.error("[EMAIL] Failed to send email:", error);
    console.error("[EMAIL] Error status:", error?.status);
    console.error("[EMAIL] Error text:", error?.text);
    alert(`Email failed: ${error?.text || error?.message || "Unknown error"}`);
  }
};
