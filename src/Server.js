//Importing required modules


import express from 'express';
import session from 'express-session';
//import fs from 'fs';

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret : "soen" }));

/// List of all user-password pairs, stored as dictionaries
const users = []


app.listen(PORT, () => {

    console.log(`Listening on port ${PORT}`);

});
