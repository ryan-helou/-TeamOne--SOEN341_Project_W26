//Importing required modules


import express from 'express';
import session from 'express-session';
import { testUserDatabase } from "./UserManagement.js";
//import fs from 'fs';

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret : "soen" }));


app.listen(PORT, () => {

    console.log(`Listening on port ${PORT}`);

});

testUserDatabase()
