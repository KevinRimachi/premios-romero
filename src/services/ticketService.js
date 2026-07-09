import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";

export const saveTicketData = async (ticketData, imageUrl, imageHash) => {
  try {
    // Referencia a la colección 'participantes' en Firestore
    const ticketsCollection = collection(db, "participantes");

    // Guardar el documento
    const docRef = await addDoc(ticketsCollection, {
      ...ticketData,
      comprobanteUrl: imageUrl,
      comprobanteHash: imageHash, // Se guarda el hash para prevenir duplicados
      createdAt: serverTimestamp(),
      status: "pending",
      estado: "pendiente", // Puedes usar esto para validar el pago más tarde
    });

    return docRef.id; // Retorna el ID del ticket generado
  } catch (error) {
    console.error("Error al guardar el ticket en Firestore:", error);
    throw error;
  }
};

export const getAllTickets = async () => {
  try {
    const ticketsCollection = collection(db, "participantes");
    const snapshot = await getDocs(ticketsCollection);
    const tickets = [];
    snapshot.forEach((doc) => {
      tickets.push({ id: doc.id, ...doc.data() });
    });
    return tickets;
  } catch (error) {
    console.error("Error al obtener tickets:", error);
    throw error;
  }
};
