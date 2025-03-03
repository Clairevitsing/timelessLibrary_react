import axios from 'axios';
import { Category } from '../models/Category'; 

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
