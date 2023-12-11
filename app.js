// ========== 0. imports and app setup =========== //
import cors from "cors";
import express from "express";
import { DataTypes } from "sequelize";
import sequelize from "./database.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // to parse JSON bodies
app.use(cors());

// ========== 1. Define Models =========== //
// Define user model
const User = sequelize.define("user", {
    // User model attributes
    name: {
        type: DataTypes.STRING,
        allowNull: false // Name is required
    },
    title: {
        type: DataTypes.STRING
    },
    mail: {
        type: DataTypes.STRING,
        allowNull: false // Email is required
    },
    image: {
        type: DataTypes.TEXT // URL to image
    }
});

// ========== 2. Synchronize Models with Database =========== //

// to automatically synchronize all models
// For development/testing purposes only.
// Drops and recreates tables.
await sequelize.sync({ force: true });

// ========== 3. Create Test Data =========== //

// For development/testing purposes only.
// Creates sample user data in the database.

// Sample users
// Sample user 1
const user1 = await User.create({
    name: "Rasmus Cederdorff",
    title: "Senior Lecturer",
    mail: "race@eaaa.dk",
    image: "https://share.cederdorff.com/images/race.jpg"
});

// Sample user 2
const user2 = await User.create({
    name: "Anne Kirketerp",
    title: "Head of Department",
    mail: "anki@eaaa.dk",
    image: "https://www.eaaa.dk/media/5buh1xeo/anne-kirketerp.jpg?width=800&height=450&rnd=133403878321500000"
});

// Sample user 3
const user3 = await User.create({
    name: "Murat Kilic",
    title: "Senior Lecturer",
    mail: "mki@eaaa.dk",
    image: "https://www.eaaa.dk/media/llyavasj/murat-kilic.jpg?width=800&height=450&rnd=133401946552600000"
});

// ========== 4. Routes  =========== //

// READ - Root endpoint
app.get("/", (request, response) => {
    response.send("Node REST API Running 🎉");
});

// READ all users
app.get("/users", async (request, response) => {
    const users = await User.findAll(); // SELECT * FROM users;
    response.json(users); // send the users as JSON
});

// READ one user by id
app.get("/users/:id", async (request, response) => {
    const id = request.params.id; // use id from url
    const users = await User.findByPk(id); // SELECT * FROM users WHERE id = id;
    response.json(users); // send the users as JSON
});

// CREATE one user
app.post("/users", async (request, response) => {
    const user = request.body; // use request body as user object
    const newUser = await User.create(user); // INSERT INTO users (name, title, mail, image) VALUES (user.name, user.title, user.mail, user.image);
    response.json(newUser); // send the new user as JSON
});

// UPDATE one user by id
app.put("/users/:id", async (request, response) => {
    const id = request.params.id; // use id from url
    const user = request.body; // use request body as user object
    const [result] = await User.update(user, { where: { id: id } }); // UPDATE users SET name = user.name, title = user.title, mail = user.mail, image = user.image WHERE id = id;
    if (result) {
        response.json({ message: "User updated" }); // send a success message as JSON
    } else {
        response.json({ message: "User not found" }); // send a not found message as JSON
    }
});

// DELETE user by id
app.delete("/users/:id", async (request, response) => {
    const id = request.params.id; // use id from url
    const result = await User.destroy({ where: { id: id } }); // DELETE FROM users WHERE id = id;

    if (result) {
        response.json({ message: "User deleted" }); // send a success message as JSON
    } else {
        response.json({ message: "User not found" }); // send a not found message as JSON
    }
});

// ========== 5. Start Server  =========== //

app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
});
