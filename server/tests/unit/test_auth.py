import pytest
from flask import json
from app.models.user import User
from app.models.tokenblocklist import TokenBlocklist
from app.auth.utils import register_user_logic, login_user_logic, logout_user_logic
from unittest.mock import patch, MagicMock

# Fixtures
@pytest.fixture
def mock_user():
    user = MagicMock(spec=User)
    user.username = "testuser"
    user.email = "test@example.com"
    user.get_email.return_value = "test@example.com"
    user.check_password.return_value = True
    return user

# Tests for register_user_logic
def test_register_user_success():
    with patch('app.models.user.User.get_user_by_username', return_value=None), \
         patch('app.models.user.User.save'):
        data = {"username": "newuser", "email": "new@example.com", "password": "password123"}
        response, status_code = register_user_logic(data)
        assert status_code == 201
        assert json.loads(response.data)["message"] == "User created"

def test_register_user_existing():
    with patch('app.models.user.User.get_user_by_username', return_value=MagicMock()):
        data = {"username": "existinguser", "email": "existing@example.com", "password": "password123"}
        response, status_code = register_user_logic(data)
        assert status_code == 409
        assert json.loads(response.data)["error"] == "User already exists"

# Tests for login_user_logic
def test_login_user_success(mock_user):
    with patch('app.models.user.User.get_user_by_username', return_value=mock_user), \
         patch('flask_jwt_extended.create_access_token', return_value="mock_access_token"), \
         patch('flask_jwt_extended.create_refresh_token', return_value="mock_refresh_token"):
        data = {"username": "testuser", "password": "correctpassword"}
        response, status_code = login_user_logic(data)
        assert status_code == 200
        response_data = json.loads(response.data)
        assert "Logged In" in response_data["message"]
        assert "access" in response_data["tokens"]
        assert "refresh" in response_data["tokens"]
        assert response_data["user"]["username"] == "testuser"

def test_login_user_invalid():
    with patch('app.models.user.User.get_user_by_username', return_value=None):
        data = {"username": "nonexistent", "password": "wrongpassword"}
        response, status_code = login_user_logic(data)
        assert status_code == 400
        assert json.loads(response.data)["error"] == "Invalid username or password"

# Tests for logout_user_logic
def test_logout_user():
    with patch('app.models.tokenblocklist.TokenBlocklist.save'):
        jwt = {"jti": "mock_jti", "type": "access"}
        response, status_code = logout_user_logic(jwt)
        assert status_code == 200
        assert "token revoked successfully" in json.loads(response.data)["message"]

# # Tests for routes (these are more like integration tests, but included for completeness)
# def test_register_route(client):
#     response = client.post('/auth/register', json={
#         "username": "newuser",
#         "email": "new@example.com",
#         "password": "password123"
#     })
#     assert response.status_code == 201
#     assert b"User created" in response.data

# def test_login_route(client):
#     # First register a user
#     client.post('/auth/register', json={
#         "username": "loginuser",
#         "email": "login@example.com",
#         "password": "password123"
#     })
    
#     # Then try to login
#     response = client.post('/auth/login', json={
#         "username": "loginuser",
#         "password": "password123"
#     })
#     assert response.status_code == 200
#     assert b"Logged In" in response.data
#     assert b"access" in response.data
#     assert b"refresh" in response.data

# @pytest.mark.parametrize("endpoint", ["/auth/whoami", "/auth/refresh", "/auth/logout"])
# def test_protected_routes_without_token(client, endpoint):
#     response = client.get(endpoint)
#     assert response.status_code in (401, 422)  # Unauthorized or Unprocessable Entity

# import pytest


# @pytest.fixture
# def first_entry():
#     return "a"


# @pytest.fixture
# def order():
#     return []


# @pytest.fixture(autouse=True)
# def append_first(order, first_entry):
#     print("first_entry : ", first_entry)
#     print("order : ", order)
#     return order.append(first_entry)


# def test_string_only(order, first_entry):
#     print("test_string_only, first_entry : ", first_entry)
#     print("test_string_only, order : ", order)
#     assert order == [first_entry]


# def test_string_and_int(order, first_entry):
#     print("test_string_and_int, first_entry : ", first_entry)
#     print("test_string_and_int, order : ", order)
#     order.append(2)
#     assert order == [first_entry, 2]