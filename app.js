// ========== 0. imports and app setup =========== //
import cors from "cors";
import express from "express";
import { DataTypes } from "sequelize";
import sequelize from "./database.js";

const app = express();
const port = process.env.PORT || 3333;

app.use(express.json()); // to parse JSON bodies
app.use(cors());

// ========== 1. Define Models =========== //
const User = sequelize.define("user", {
    // Model attributes are defined here
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mail: {
        type: DataTypes.STRING
    }
});

console.log(User === sequelize.models.user); // true

// ========== 2. Synchronize Models =========== //

// to automatically synchronize all models
await sequelize.sync({ force: true });

// ========== 3. Define Test Data =========== //
const race = User.create({ name: "Rasmus Cederdorff", mail: "race@eaaa.dk" });
console.log(race.id);

// ========== 4. Routes  =========== //

app.get("/", async (req, res) => {
    const users = await User.findAll();
    console.log(users);

    res.json(users);
});

// // READ all users
// app.get("/users", (request, response) => {
//     // sql query to select all from the table users
//     const query = "SELECT * FROM users ORDER BY name;";
//     connection.query(query, (error, results, fields) => {
//         if (error) {
//             console.log(error);
//         } else {
//             response.json(results);
//         }
//     });
// });

// // READ one user
// app.get("/users/:id", (request, response) => {
//     const id = request.params.id;
//     const query = "SELECT * FROM users WHERE id=?;"; // sql query
//     const values = [id];

//     connection.query(query, values, (error, results, fields) => {
//         if (error) {
//             console.log(error);
//         } else {
//             response.json(results[0]);
//         }
//     });
// });

// // CREATE user
// app.post("/users", (request, response) => {
//     const user = request.body;
//     const query = "INSERT INTO users(name, mail, title, image) values(?,?,?,?);"; // sql query
//     // const query = "INSERT INTO users SET name=?, mail=?, title=?, image=?;"; // sql query
//     const values = [user.name, user.mail, user.title, user.image];

//     connection.query(query, values, (error, results, fields) => {
//         if (error) {
//             console.log(error);
//         } else {
//             response.json(results);
//         }
//     });
// });

// // UPDATE user
// app.put("/users/:id", (request, response) => {
//     const id = request.params.id;
//     const user = request.body;
//     const query = "UPDATE users SET name=?, mail=?, title=?, image=? WHERE id=?;"; // sql query
//     // const query = `UPDATE users SET name="${user.name}", mail="${user.mail}", title="${user.title}", image="${user.image}" WHERE id=${id};`; // sql query
//     const values = [user.name, user.mail, user.title, user.image, id];

//     connection.query(query, values, (error, results, fields) => {
//         if (error) {
//             console.log(error);
//         } else {
//             response.json(results);
//         }
//     });
// });

// // DELETE user
// app.delete("/users/:id", (request, response) => {
//     const id = request.params.id; // tager id fra url'en, så det kan anvendes til at finde den givne bruger med "det" id.
//     const query = "DELETE FROM users WHERE id=?;"; // sql query
//     const values = [id];

//     connection.query(query, values, (error, results, fields) => {
//         if (error) {
//             console.log(error);
//         } else {
//             response.json(results);
//         }
//     });
// });

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
    console.log(`App listening on http://localhost:${port}`);
    console.log(`Users Endpoint http://localhost:${port}/users`);
});
