import express from 'express';
import session from 'express-session';
//import { testUserDatabase } from "./UserManagement.js";

import { loadUsers, saveUsers, getUserAttribute, registerUser, loginUser, updateUser, changePassword } from "./UserManagement.js";
import { loadRecipes, addRecipe, getAllRecipes, getRecipesByUser, updateRecipe, deleteRecipe, filterRecipes } from "./RecipeManagement.js";

const app = express();
const PORT = 3000;
loadUsers();
loadRecipes();

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
        return res.send({ success: false, message: "Session expired" });
    }
    const result = updateUser(req.session.username, req.body);
    return res.send(result);
});

app.post("/change-password", (req, res) => {
    if (!req.session.username) {
        return res.send({ success: false, message: "Session expired" });
    }
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        return res.send({ success: false, message: "New passwords do not match" });
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
        return res.send({ success: false })

    saveUsers();

    req.session.destroy(error => {
        if (error) {
            return res.send({ success: false });
        }
        return res.send({ success: true });
    });
});

app.post("/recipes", (req, res) => {
    if (!req.session.username) {
        return res.send({ success: false, message: "Session expired" });
    }
    const result = addRecipe(req.session.username, req.body);
    return res.send(result);
});

app.get("/recipes", (req, res) => {
    return res.send(getAllRecipes());
});

app.post("/recipes/:id", (req, res) => {
    if (!req.session.username) {
        return res.send({ success: false, message: "Session expired" });
    }
    const id = parseInt(req.params.id);
    const result = updateRecipe(id, req.session.username, req.body);
    return res.send(result);
});

app.delete("/recipes/:id", (req, res) => {
    if (!req.session.username) {
        return res.send({ success: false, message: "Session expired" });
    }
    const id = parseInt(req.params.id);
    const result = deleteRecipe(id, req.session.username);
    return res.send(result);
});

app.get("/recipes/mine", (req, res) => {
    if (!req.session.username) {
        return res.send({ success: false, message: "Session expired" });
    }
    return res.send(getRecipesByUser(req.session.username));
});

app.post("/recipes/filter", (req, res) => {
    if (!req.session.username)
        return res.send({ success: false, message: "Session expired" });

    const userRecipes = getRecipesByUser(req.session.username);
    const filterCriteria = {
        title : req.body.title || undefined,
        ingredients : Array.isArray(req.body.ingredients)
            ? req.body.ingredients
            : req.body.ingredients ? [req.body.ingredients] : undefined,
        instructions: req.body.instructions || undefined,
        prepTime: req.body.prepTime || undefined,
        difficulty: req.body.difficulty || undefined,
        cost: req.body.cost || undefined,
        dietaryTags : Array.isArray(req.body.dietaryTags)
            ? req.body.dietaryTags
            : req.body.dietaryTags ? [req.body.dietaryTags] : undefined,
    }

    res.send({ success: true, recipes: filterRecipes(userRecipes, filterCriteria) });
});

app.listen(PORT, () => {

    console.log(`Listening on port ${PORT}`);

});
