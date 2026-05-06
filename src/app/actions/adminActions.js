"use server";

export async function verifyAdminPassword(password) {
  const correctPassword = process.env.ADMIN_SECRET;
  
  if (!correctPassword) {
    console.error("ADMIN_SECRET no está configurado en las variables de entorno.");
    return false;
  }

  return password === correctPassword;
}
