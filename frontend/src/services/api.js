const API_BASE_URL = "http://localhost:3000/api"; // Update if necessary

export async function fetchInventory() {
    const response = await fetch(`${API_BASE_URL}/inventory`);
    console.log("API Response:", response);
    if (!response.ok) {
        throw new Error("Failed to fetch inventory data");
    }
    const data = await response.json();
    console.log("Parsed JSON:", data);
    return data;
}

export async function updateInventoryItem(id, item) {
    const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
    });
    if (!response.ok) {
        throw new Error("Failed to update inventory item");
    }
    return await response.json();
}

export async function deleteInventoryItem(id) {
    const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Failed to delete inventory item");
    }
    return await response.json();
}