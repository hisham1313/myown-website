from fastapi.testclient import TestClient
from Backend.app.main import app

client = TestClient(app)

def test_read_main():
    # We don't have a root / endpoint, checking docs instead or 404
    response = client.get("/")
    assert response.status_code == 404

def test_create_user_and_login():
    # 1. Register
    username = "testuser_automated"
    email = "test_automated@example.com"
    password = "testpassword123"
    
    # Clean up if exists (mocking naive cleanup by ignoring error for this snippet)
    # in a real test we'd use a separate test db
    
    response = client.post("/api/register", json={
        "username": username,
        "email": email,
        "password": password
    })
    # expecting 200 or 400 if already exists
    assert response.status_code in [200, 400]

    # 2. Login
    response = client.post("/api/login", data={
        "username": email,
        "password": password
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    
    # 3. Verify user info is returned
    assert "user" in data
    assert data["user"]["email"] == email

    # 4. Get User Profile
    token = data["access_token"]
    response = client.get("/api/users/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    profile = response.json()
    assert profile["email"] == email
    assert "joinedDate" in profile
