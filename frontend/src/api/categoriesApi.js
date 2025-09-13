import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/api/categories`;

export const getAllCategories = async () => {
  try {
    console.log('🔍 Fetching categories from:', API_URL);
    const res = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    console.log('✅ Categories fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    throw error;
  }
};

export const createCategory = async (category) => {
  try {
    console.log('➕ Creating category:', category);
    console.log('📡 POST URL:', API_URL);
    
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(category),
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP error! status: ${res.status}, message: ${errorText}`);
    }
    
    const data = await res.json();
    console.log('✅ Category created successfully:', data);
    return data;
  } catch (error) {
    console.error('❌ Error creating category:', error);
    throw error;
  }
};