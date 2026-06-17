import jsPDF from 'jspdf';

export const generateInvoicePdf = async (notification) => {
  try {
    // Extract data with fallbacks
    const id = notification.idReservation || notification.id || 'N/A';
    const clientName = notification.clientName || 'Unknown Client';
    const clientEmail = notification.clientEmail || 'N/A';
    const clientPhone = notification.clientPhone || 'N/A';
    
    const roomName = notification.roomName || 'Unknown Room';
    const roomCapacity = notification.roomCapacity || '-';
    
    const checkInStr = notification.dateDebut ? new Date(notification.dateDebut).toLocaleDateString() : 'N/A';
    const checkOutStr = notification.dateFin ? new Date(notification.dateFin).toLocaleDateString() : 'N/A';
    
    let nights = notification.nights || 1;
    if (!notification.nights && notification.dateDebut && notification.dateFin) {
      const start = new Date(notification.dateDebut);
      const end = new Date(notification.dateFin);
      const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      if (diff > 0) nights = diff;
    }
    
    const totalPrice = notification.prixTotal || notification.totalPrice || 0;
    // If roomPrice isn't provided directly, try to compute it or fallback to the provided roomPrice
    let pricePerNight = notification.roomPrice || 0;
    if (!pricePerNight && totalPrice > 0) {
        pricePerNight = (totalPrice / nights).toFixed(2);
    }
    
    const currentDate = new Date().toLocaleDateString();

    // Create jsPDF instance (A4 paper)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // --- Header ---
    // FACTURE
    pdf.setFontSize(24);
    pdf.setTextColor(30, 58, 138); // blue-900 (#1e3a8a)
    pdf.text("FACTURE", 20, 25);
    
    pdf.setFontSize(10);
    pdf.setTextColor(107, 114, 128); // gray-500 (#6b7280)
    const shortId = id !== 'N/A' ? id.slice(0, 8) : id;
    pdf.text("Invoice Number: FACT-" + shortId, 20, 32);
    pdf.text("Date: " + currentDate, 20, 37);
    
    // Payment Status "Paid"
    pdf.text("Payment Status: ", 20, 42);
    pdf.setTextColor(22, 163, 74); // green-600 (#16a34a)
    pdf.text("Paid", 48, 42);

    // Dar Diafa Rabat (Right side)
    pdf.setFontSize(16);
    pdf.setTextColor(180, 83, 9); // amber-700 / gold (#b45309)
    pdf.text("Dar Diafa Rabat", 190, 25, { align: "right" });
    
    pdf.setFontSize(10);
    pdf.setTextColor(75, 85, 99); // gray-600 (#4b5563)
    pdf.text("Rabat, Morocco", 190, 32, { align: "right" });
    pdf.text("contact@dardiafa.ma", 190, 37, { align: "right" });

    // Separator line
    pdf.setDrawColor(229, 231, 235); // gray-200 (#e5e7eb)
    pdf.setLineWidth(0.5);
    pdf.line(20, 48, 190, 48);

    // --- Details Section ---
    // Billed To
    pdf.setFontSize(12);
    pdf.setTextColor(55, 65, 81); // gray-700 (#374151)
    pdf.text("Billed To:", 20, 60);
    
    pdf.setFontSize(11);
    pdf.setTextColor(17, 24, 39); // gray-900 (#111827)
    pdf.text(clientName, 20, 67);
    
    pdf.setFontSize(10);
    pdf.setTextColor(75, 85, 99); // gray-600
    pdf.text("Email: " + clientEmail, 20, 72);
    pdf.text("Phone: " + clientPhone, 20, 77);

    // Reservation Info
    pdf.setFontSize(12);
    pdf.setTextColor(55, 65, 81);
    pdf.text("Reservation Info:", 120, 60);
    
    pdf.setFontSize(10);
    pdf.setTextColor(75, 85, 99);
    pdf.text("Res ID: " + id, 120, 67);
    pdf.text("Check-in: " + checkInStr, 120, 72);
    pdf.text("Check-out: " + checkOutStr, 120, 77);

    // --- Table ---
    // Table Header Background
    pdf.setFillColor(249, 250, 251); // gray-50 (#f9fafb)
    pdf.rect(20, 90, 170, 10, 'F');
    pdf.setDrawColor(229, 231, 235); // gray-200
    pdf.line(20, 90, 190, 90);
    pdf.line(20, 100, 190, 100);

    // Table Header Text
    pdf.setFontSize(10);
    pdf.setTextColor(55, 65, 81);
    pdf.text("Room Description", 25, 96);
    pdf.text("Capacity", 90, 96, { align: "center" });
    pdf.text("Nights", 120, 96, { align: "center" });
    pdf.text("Price / Night", 155, 96, { align: "right" });
    pdf.text("Total", 185, 96, { align: "right" });

    // Table Row Text
    pdf.setTextColor(17, 24, 39); // gray-900
    // Long room names might bleed out, but we'll assume it fits in 60mm space
    pdf.text(roomName.substring(0, 35), 25, 110);
    
    pdf.setTextColor(75, 85, 99); // gray-600
    pdf.text(String(roomCapacity), 90, 110, { align: "center" });
    pdf.text(String(nights), 120, 110, { align: "center" });
    pdf.text("$" + Number(pricePerNight).toFixed(2), 155, 110, { align: "right" });
    
    pdf.setTextColor(17, 24, 39); // gray-900
    pdf.text("$" + Number(totalPrice).toFixed(2), 185, 110, { align: "right" });
    
    // Table Row Bottom Line
    pdf.setDrawColor(229, 231, 235);
    pdf.line(20, 115, 190, 115);

    // --- Total Section ---
    pdf.setFillColor(249, 250, 251); // gray-50
    pdf.rect(120, 125, 70, 35, 'F');
    pdf.setDrawColor(229, 231, 235); // gray-200
    pdf.rect(120, 125, 70, 35); // border

    pdf.setFontSize(10);
    pdf.setTextColor(75, 85, 99);
    pdf.text("Subtotal:", 125, 135);
    pdf.text("$" + Number(totalPrice).toFixed(2), 185, 135, { align: "right" });
    
    pdf.text("Tax (0%):", 125, 142);
    pdf.text("$0.00", 185, 142, { align: "right" });
    
    pdf.setDrawColor(209, 213, 219); // gray-300
    pdf.line(125, 147, 185, 147);
    
    pdf.setFontSize(12);
    pdf.setTextColor(17, 24, 39);
    pdf.text("Total Amount:", 125, 154);
    pdf.text("$" + Number(totalPrice).toFixed(2), 185, 154, { align: "right" });

    // --- Footer ---
    pdf.setDrawColor(229, 231, 235);
    pdf.line(20, 280, 190, 280);
    
    pdf.setFontSize(9);
    pdf.setTextColor(107, 114, 128);
    // Standard font is used (no italics mapping loaded by default)
    pdf.text("Merci pour votre confiance. Dar Diafa Rabat vous souhaite un agreable sejour.", 105, 287, { align: "center" });

    // Save PDF
    pdf.save(`facture-reservation-${id}.pdf`);
    
  } catch (err) {
    console.error("Error generating invoice PDF:", err);
    throw err;
  }
};
