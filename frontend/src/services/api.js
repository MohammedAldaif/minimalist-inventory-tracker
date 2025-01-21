import { getAuth } from "firebase/auth";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000/api"; // Use environment variable

async function getAuthToken() {
    try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            return await user.getIdToken();
        }
        throw new Error("User is not authenticated");
    } catch (error) {
        console.error("Error getting auth token:", error);
        throw error;
    }
}

export async function fetchInventory() {
    try {
        const token = await getAuthToken();
        const response = await fetch(`${API_BASE_URL}/inventory`, {
            headers: {
                Authorization: `Bearer ${token}`, // Include auth token
            },
        });

        console.log("API Response:", response);
        if (!response.ok) {
            throw new Error(`Failed to fetch inventory data: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Parsed JSON:", data);
        return data;
    } catch (error) {
        console.error("Error fetching inventory:", error);
        throw error;
    }
}

export async function updateInventoryItem(id, item) {
    try {
        const token = await getAuthToken();
        const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Include auth token
            },
            body: JSON.stringify(item),
        });

        if (!response.ok) {
            throw new Error(`Failed to update inventory item: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error updating inventory item:", error);
        throw error;
    }
}

export async function deleteInventoryItem(id) {
    try {
        const token = await getAuthToken();
        const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`, // Include auth token
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to delete inventory item: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error deleting inventory item:", error);
        throw error;
    }
}