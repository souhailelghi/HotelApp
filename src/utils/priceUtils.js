export function calculateReservationTotals(reservation = {}, room = {}) {
  const pricePerNight =
    Number(reservation.roomPrice) ||
    Number(room.pricePerNight) ||
    Number(room.currentPrice) ||
    0;

  let nights = Number(reservation.nights);
  if (!nights && reservation.dateDebut && reservation.dateFin) {
    const start = new Date(reservation.dateDebut);
    const end = new Date(reservation.dateFin);
    nights = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  } else if (!nights || isNaN(nights)) {
    nights = 1;
  }

  const subtotal = pricePerNight * nights;
  const taxRate = 0.10;
  const taxes = subtotal * taxRate;
  const totalTTC = subtotal + taxes;

  return {
    pricePerNight,
    nights,
    subtotal,
    taxRate,
    taxes,
    totalTTC
  };
}

export function formatDH(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return "0 DH";
  return `${Number(amount).toFixed(2).replace(/\.00$/, '')} DH`;
}
