import axios from "axios";

const API_BASE_URL = "http://localhost:3000"; // Replace with your backend URL if different

// Fetch all inventory items
export const getInventory = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/inventory`);
        return response.data;
    } catch (error) {
        console.error("Error fetching inventory data:", error.message);
        throw error;
    }
};
