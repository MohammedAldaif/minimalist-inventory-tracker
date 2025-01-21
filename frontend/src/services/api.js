import { getAuth } from "firebase/auth";

// ✅ Update API_BASE_URL to your actual backend URL
const API_BASE_URL = "https://simple-inventory-tracker.netlify.app";

// ✅ Debug Auth Token Retrieval
async function getAuthToken() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        console.log("Auth Token:", token); // Debug log
        return token;
    }
    console.error("User is not authenticated");
    throw new Error("User is not authenticated");
}

// ✅ Fetch Inventory (Fixed for Mobile)
export async function fetchInventory() {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/inventory`, {
        method: "GET",
        credentials: "include", // Ensure cookies/auth headers are sent
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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

// ✅ Update Inventory Item
export async function updateInventoryItem(id, item) {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(item),
    });
    if (!response.ok) {
        throw new Error("Failed to update inventory item");
    }
    return await response.json();
}

// ✅ Delete Inventory Item
export async function deleteInventoryItem(id) {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error("Failed to delete inventory item");
    }
    return await response.json();
}