import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const file_name = fileURLToPath(import.meta.url);
const dir = path.dirname(file_name);

const data_path = path.join(dir, "Data", "user_data.json");

let users = []

/// Loads the user dictionaries from the database
function loadUsers() {
    try {
        if (!fs.existsSync(data_path)) {
            users = []
            return;
        }
        let textContent = fs.readFileSync(data_path, "utf-8");
        textContent = textContent.trim()
        users =  textContent ? JSON.parse(textContent) : []
        
    } catch (error) {
        console.log("Error loading user files -", error);
        users = [];
    }
}

/// Saves the user-password pairs to the database
function saveUsers() {
    try {
        fs.writeFileSync(
            data_path,
            JSON.stringify(users, null, 2),
            "utf8"
        );
    } catch (error) {
        console.log("Error saving user files -", error);
    }
}

/// Returns the user with the specified username, returns an empty dict if user does not exist
function getUser(username) {
    for (let user in users) {
        if (user.username == username) {
            return user;
        }
    }
    return {};
}

/// Add a new user to the list of all users
function addUser(user) {
    for (let u in users) {
        if (u.username == user.username) {
            return;
        }
    }
    users.push(user);
}

/// Update the data of the user with the new info
function updateUser(username, newInfo) {

}

/// Returns true if the username exists and the password is correct, false otherwise
function authenticateUser(username, password) {

}

/// Creates a new user if the username doesn't already exist
function createNewUser(username, password) {
    
}

/// Returns true if the username is already in the database
function userAlreadyExists(username) {

}

/// Allows a user to change their password
function changePassword(username, oldPassword, newPassword) {

}

export function testUserDatabase() {
    loadUsers();
    addUser({
        username : "TestUser",
        password : "hello123",
        diet : "likes food"
    });
    saveUsers()
}