// src/utils/auth.ts

export interface UserSession {
  nombre: string;
  rol: 'presidenta' | 'tesorero' | 'referente' | 'user';
  clubId: number;
}

// Obtiene el usuario del localStorage de forma segura
export const getUser = (): UserSession | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

// Verifica si el usuario actual tiene alguno de los roles permitidos
export const hasRole = (allowedRoles: string[]): boolean => {
  const user = getUser();
  if (!user) return false;
  
  // La presidenta siempre tiene acceso (Super Admin)
  if (user.rol === 'presidenta') return true;
  
  return allowedRoles.includes(user.rol);
};