import { getAuth } from "firebase/auth";
const API_BASE_URL = "http://localhost:3000/api"; // Update if necessary
async function getAuthToken() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
        return await user.getIdToken();
    }
    throw new Error("User is not authenticated");
}

export async function fetchInventory() {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/inventory`, {
        headers: {
            Authorization: `Bearer ${token}`, // Include auth token
        },
    });

    console.log("API Response:", response);
    if (!response.ok) {
        throw new Error("Failed to fetch inventory data");
    }
    const data = await response.json();
    console.log("Parsed JSON:", data);
    return data;
}

export async function updateInventoryItem(id, item) {
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
        throw new Error("Failed to update inventory item");
    }
    return await response.json();
}

export async function deleteInventoryItem(id) {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`, // Include auth token
        },
    });
    if (!response.ok) {
        throw new Error("Failed to delete inventory item");
    }
    return await response.json();
}
