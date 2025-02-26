
export type Author = {
  id: number;
  firstName: string;
  lastName: string;
  birthDate?: Date | null;  
  // Optional biography
  biography?: string;      
}
