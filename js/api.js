const API_BASE_URL = "http://127.0.0.1:5555/api";

export const APIService = {

    // --- PRODUCTS CRUD ---
    // READ
    async getProducts() {
        const response = await fetch(`${API_BASE_URL}/products`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.detail || "Failed to fetch products");
        }
        return data;
    },

    // CREATE
    async createProduct(productData) {
        const token = localStorage.getItem('access_token');
        if (!token) throw new Error("Authentication required. Please login again.");

        const response = await fetch(`${API_BASE_URL}/products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(productData)
        });

        const data = await response.json();
        if (!response.ok) {
            if (response.status === 401) throw new Error("Session expired. Please login again.");
            throw new Error(data.detail || "Failed to create product");
        }
        return data;
    },

    // UPDATE
    async updateProduct(id, productData) {
        const token = localStorage.getItem('access_token');
        if (!token) throw new Error("Authentication required.");

        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(productData)
        });

        const data = await response.json();
        if (!response.ok) {
            if (response.status === 401) throw new Error("Session expired.");
            throw new Error(data.detail || "Failed to update product");
        }
        return data;
    },

    // DELETE
    async deleteProduct(id) {
        const token = localStorage.getItem('access_token');
        if (!token) throw new Error("Authentication required.");

        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (!response.ok) {
            if (response.status === 401) throw new Error("Session expired.");
            throw new Error(data.detail || "Failed to delete product");
        }
        return data;
    },

    // --- AUTHENTICATION (REAL BACKEND) ---

    async registerUser(userData) {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: userData.name,   // frontend "name" → backend "username"
                email: userData.email,
                password: userData.password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Registration failed");
        }

        return data;
    },

    async loginUser(credentials) {
        const formData = new URLSearchParams();
        formData.append("username", credentials.email); // OAuth expects "username"
        formData.append("password", credentials.password);

        const response = await fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Invalid email or password");
        }

        return data;
    },

    async getUserProfile() {
        const token = localStorage.getItem('access_token');
        if (!token) throw new Error("Not authenticated");

        const response = await fetch(`${API_BASE_URL}/users/me`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch profile");
        }

        return await response.json();
    },

    async sendInfo(data) {
        const response = await fetch(`${API_BASE_URL}/contact`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error("Failed to send message");
        return await response.json();
    }
}