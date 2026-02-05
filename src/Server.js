import express from 'express';
import session from 'express-session';
//import { testUserDatabase } from "./UserManagement.js";

import { loadUsers, authenticateUser, saveUsers, getUserAttribute, registerUser } from "./UserManagement.js";

const app = express();
const PORT = 3000;
loadUsers();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret : "soen" }));
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

    if (!authenticateUser(username, password)) {
        return res.send({success : false});
    }

    req.session.username = username;
    return res.send({success : true})
});

app.get("/user/:key", (req, res) => {
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
