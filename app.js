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
        type: DataTypes.STRING
    }
});

console.log(User === sequelize.models.user); // true

// ========== 2. Synchronize Models with Database =========== //

// to automatically synchronize all models
// For development/testing purposes only.
// Drops and recreates tables.
await sequelize.sync({ force: true });

// ========== 3. Create Test Data =========== //

// For development/testing purposes only.
// Creates sample user data in the database.

// Sample user 1
User.create({
    name: "Rasmus Cederdorff",
    title: "Senior Lecturer",
    mail: "race@eaaa.dk",
    image: "https://share.cederdorff.com/images/race.jpg"
});

// Sample user 2
User.create({
    name: "Anne Kirketerp",
    title: "Head of Department",
    mail: "anki@eaaa.dk",
    image: "https://www.eaaa.dk/media/5buh1xeo/anne-kirketerp.jpg?width=800&height=450&rnd=133403878321500000"
});

// Sample user 3
User.create({
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
    const users = await User.findAll();

    response.json(users);
});

// READ one user by id
app.get("/users/:id", async (request, response) => {
    const id = request.params.id;
    const users = await User.findByPk(id);

    response.json(users);
});

// CREATE one user
app.post("/users", async (request, response) => {
    const user = request.body;

    const newUser = await User.create(user);
    response.json(newUser);
});

// UPDATE one user by id
app.put("/users/:id", async (request, response) => {
    const id = request.params.id;
    const user = request.body;

    const [result] = await User.update(user, { where: { id: id } });

    if (result) {
        response.json({ message: "User updated" });
    } else {
        response.json({ message: "User not found" });
    }
});

// DELETE user by id
app.delete("/users/:id", async (request, response) => {
    const id = request.params.id; // tager id fra url'en, så det kan anvendes til at finde den givne bruger med "det" id.
    const result = await User.destroy({ where: { id: id } });

    if (result) {
        response.json({ message: "User deleted" });
    } else {
        response.json({ message: "User not found" });
    }
});

// ========== 5. Start Server  =========== //

app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
});
