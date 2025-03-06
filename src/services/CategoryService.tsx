import axios from 'axios';
import { Category } from '../models/Category'; 
import { Book } from '../models/Book'; 

const BASE_API_URL = "http://127.0.0.1:8000/api/categories";

export const fetchCategories = async (): Promise<Category[]> => {
    try {
        const response = await axios.get(BASE_API_URL);
        console.log("API response:", response.data);

        if (!response.data || !Array.isArray(response.data)) {
            throw new Error('No categories data found in response or response format is incorrect');
        }

        return response.data.map((categoryData: any): Category => ({
            id: categoryData.id,
            name: categoryData.name,
            description: categoryData.description
        }));
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw new Error('Failed to fetch categories');
    }
};

export const fetchCategoryById = async (categoryId: number): Promise<Category> => {
  try {
    const response = await axios.get(`${BASE_API_URL}/${categoryId}`);
    
    if (!response.data) {
      throw new Error('Aucune donnée de catégorie trouvée');
    }
    
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de la catégorie ${categoryId}:`, error);
    throw new Error('Échec de la récupération de la catégorie');
  }
};

export const createNewCategory = async (categoryData: { name: string, description: string }) => {
  try {
    const response = await axios.post(`${BASE_API_URL}/new`, categoryData);
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const updateCategory = async (id: number, categoryData: { name: string, description: string }) => {
  try {
    const response = await axios.put(`${BASE_API_URL}/${id}/edit`, categoryData);
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const deleteCategory = async (categoryId: number): Promise<void> => {
  try {
    await axios.delete(`${BASE_API_URL}/${categoryId}`);
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

export const fetchBooksByCategory = async (categoryId: number): Promise<Book[]> => {
  try {
    const response = await axios.get(`${BASE_API_URL}/${categoryId}/books`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      // Return an empty array if no books are found
      return [];
    }
    console.error('Error fetching books by category:', error);
    throw error;
  }
};
