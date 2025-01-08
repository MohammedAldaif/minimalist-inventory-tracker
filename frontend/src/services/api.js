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
