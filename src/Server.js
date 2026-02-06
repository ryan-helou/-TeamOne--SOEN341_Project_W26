import express from 'express';
import session from 'express-session';
//import { testUserDatabase } from "./UserManagement.js";

import { loadUsers, saveUsers, getUserAttribute, registerUser, loginUser, updateUser, changePassword } from "./UserManagement.js";

const app = express();
const PORT = 3000;
loadUsers();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "soen",
    resave: false,
    saveUninitialized: false
}));
app.use(express.json());

app.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const result = registerUser(username, password);
    return res.send(result);
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const result = loginUser(username, password);

    if (!result.success) {
        return res.send(result);
    }

    req.session.username = username;
    return res.send(result);
});

app.post("/update-profile", (req, res) => {
    if (!req.session.username) {
        return res.send({success : false, message: "Session expired"});
    }
    const result = updateUser(req.session.username, req.body);
    return res.send(result);
});

app.post("/change-password", (req, res) => {
    if (!req.session.username) {
        return res.send({success : false, message: "Session expired"});
    }
    const {oldPassword, newPassword, confirmPassword} = req.body;

    if (newPassword !== confirmPassword) {
        return res.send({success : false, message: "New passwords do not match"});
    }

    const result = changePassword(req.session.username, oldPassword, newPassword);
    return res.send(result);
});

app.get("/user/:key", (req, res) => {
    console.log("Hello")
    console.log(req.session.username)
    if (!req.session.username) {
        return res.send(undefined)
    }

    const username = req.session.username;
    res.send(getUserAttribute(req.params.key, username));
});

app.get("/logout", (req, res) => {
    if (!req.session.username)
        return res.send({success : false})

    saveUsers();

    req.session.destroy(error => {
        if (error) {
            return res.send({success : false});
        }
        return res.send({success : true});
    });
});

app.listen(PORT, () => {

    console.log(`Listening on port ${PORT}`);

});
