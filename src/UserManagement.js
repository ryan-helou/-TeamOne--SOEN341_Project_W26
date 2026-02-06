import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const file_name = fileURLToPath(import.meta.url);
const dir = path.dirname(file_name);

const data_path = path.join(dir, "Data", "user_data.json");

const referenceUser = {
    username : "TestUser",
    fullName : "Happy Weewee",
    password : "hello123",
    diet : "likes food",
    allergies : "Idiot",
    preferences : "Imbecile"
}

let users = []

/// Loads the user dictionaries from the database
export function loadUsers() {
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
    users.forEach(validateUser)
}

/// Saves the user-password pairs to the database
export function saveUsers() {
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
export function getUser(username) {
    return users.find(user => user?.username === username);
}

/// Add a new user to the list of all users
function addUser(user) {
    if (users.some(u => u.username === user.username))
        return;
    validateUser(user)
    users.push(user);
}

/// Update the data of the user with the new info
export function updateUser(username, newInfo) {
    const user = getUser(username);
    if (!user) return { success: false, message: "User not found" };

    Object.assign(user, newInfo);
    validateUser(user); // Keeps the "referenceUser" structure intact
    saveUsers();
    return { success: true, message: "Profile updated successfully" };
}

function removeUser(username, password) {
    users = users.filter(
        user => !(user.username === username && user.password === password)
    );
}

/// Returns true if the username exists and the password is correct, false otherwise
export function authenticateUser(username, password) {
    return users.some(user => user.username === username && user.password === password)
}

/// Login function with detailed error messages
export function loginUser(username, password) {
    // Check if username exists
    if (!userAlreadyExists(username)) {
        return { success: false, message: "Username does not exist" };
    }

    // Check if password is correct
    if (!authenticateUser(username, password)) {
        return { success: false, message: "Incorrect password" };
    }

    return { success: true, message: "Login successful" };
}

/// Creates a new user if the username doesn't already exist
function createNewUser(username, password) {
    if (users.some(user => user?.username === username))
        return;
    addUser({
        username : username,
        password : password
    });
}

/// Returns true if the username is already in the database
export function userAlreadyExists(username) {
    return users.some(user => user.username === username);
}

/// Validates password strength - returns true if strong, false otherwise
export function isPasswordStrong(password) {
    if (password.length < 8) {
        return false; // Too short
    }
    if (!/[A-Z]/.test(password)) {
        return false; // No uppercase letter
    }
    if (!/[a-z]/.test(password)) {
        return false; // No lowercase letter
    }
    if (!/[0-9]/.test(password)) {
        return false; // No number
    }
    return true;
}

/// Registers a new user - returns success message or error message
export function registerUser(username, password) {
    // Check if user already exists
    if (userAlreadyExists(username)) {
        return { success: false, message: "Username already exists" };
    }

    // Check password strength
    if (!isPasswordStrong(password)) {
        return {
            success: false,
            message: "Password must be at least 8 characters with uppercase, lowercase, and a number"
        };
    }

    // Create the new user
    createNewUser(username, password);
    saveUsers(); // Save to file

    return { success: true, message: "User registered successfully" };
}

/// Allows a user to change their password
export function changePassword(username, oldPassword, newPassword) {
    const user = getUser(username);
    if (user && user.password === oldPassword) {
        user.password = newPassword;
        saveUsers();
        return { success: true, message: "Password changed successfully" };
    }
    return { success: false, message: "Incorrect old password" };
}

/// Adds an attribute to all users, by providing a new key and an initial value
function addAttributeToUsers(key, initialValue) {
    referenceUser[key] = initialValue;
    users.forEach(user => {
        if (!(key in user)) {
            user[key] = initialValue;
        }
    })
}

export function getUserAttribute(key, username) {
    const user = getUser(username);
    if (!user) {
        return undefined;
    }
    return user[key];
}

/// Checks that the user has all the attributes needed, and adds missing attributes
/// Uses referenceUser as reference
function validateUser(user) {
    for (const key of Object.keys(referenceUser)) {
        if (!(key in user)) {
            user[key] = referenceUser[key];
        }
    }
}

export function testUserDatabase() {
    const user1 = {
        username : "user1",
        password : "Hello1",
        diet : "burgers"
    }
    const user2 = {
        username : "user2",
        password : "Hello2",
        diet : "shrimp"
    }
    const user3 = {
        username : "user3",
        password : "Hello3"
    }


    users = [user1, user2]

    console.log("User 1 has diet, expected true", "diet" in user1)
    console.log("User 3 has diet, expected false", "diet" in user3)
    addUser(user3)
    console.log("User 3 has diet, expected true", "diet" in user3)
    console.log("User3 diet :", user3.diet)
    
    console.log("Getting user2 and printing password (expected Hello2) :", getUser("user2").password)
    console.log("Getting user4 (undefined) :", getUser("user4"))

    updateUser("user3", {
        password : "PP",
        diet : "vegan"
    })
    console.log("Updating user3 (expected user3, PP, vegan)", user3.username, user3.password, user3.diet)

    removeUser("user2", "Weewee");
    console.log("Tried to remove user with wrong password, user still exists:", getUser("user2") !== undefined)

    removeUser("user2", "Hello2");
    console.log("Tried to remove user with correct password, user still exists:", getUser("user2") !== undefined)

    console.log("trying to add user that already exists...")
    addUser({
        username : "user1"
    })

    console.log("User 1 already exists (expected true) :", userAlreadyExists("user1"))

    changePassword("user3", "Ah!", "ABC")
    console.log("Changing user 3 password with incorrect password (should be PP) :", user3.password)

    changePassword("user3", "PP", "ABC")
    console.log("Changing user 3 password (should be ABC) :", user3.password)

    addAttributeToUsers("meat", "medium rare")
    console.log("Adding attributes to all users (expected medium rare):", user1.meat)

    console.log("readding user2...")
    addUser(user2)

    saveUsers();
}
