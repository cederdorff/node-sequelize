// ========== 0. imports and app setup =========== //
import cors from "cors";
import express from "express";
import { DataTypes } from "sequelize";
import sequelize from "./database.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // to parse JSON bodies
app.use(cors()); // to allow Cross-origin resource sharing (CORS)

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

// Define post model
const Post = sequelize.define("post", {
    // Post model attributes
    caption: {
        type: DataTypes.STRING,
        allowNull: false // Title is required
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: false // Image is required
    }
});

// ========== 1.1 Define Associations =========== //
// Define the association
User.hasMany(Post); // One-to-many relationship between User and Post
Post.belongsTo(User); // One-to-one relationship between Post and User'

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
const rasmus = await User.create({
    name: "Rasmus Cederdorff",
    title: "Senior Lecturer",
    mail: "race@eaaa.dk",
    image: "https://share.cederdorff.com/images/race.jpg"
});

// Sample user 2
const anne = await User.create({
    name: "Anne Kirketerp",
    title: "Head of Department",
    mail: "anki@eaaa.dk",
    image: "https://www.eaaa.dk/media/5buh1xeo/anne-kirketerp.jpg?width=800&height=450&rnd=133403878321500000"
});

// Sample user 3
const murat = await User.create({
    name: "Murat Kilic",
    title: "Senior Lecturer",
    mail: "mki@eaaa.dk",
    image: "https://www.eaaa.dk/media/llyavasj/murat-kilic.jpg?width=800&height=450&rnd=133401946552600000"
});

// Sample posts
const firstPost = await Post.create({
    caption: "First post",
    image: "https://picsum.photos/800/450"
});

const secondPost = await Post.create({
    caption: "Second post",
    image: "https://picsum.photos/800/450"
});

const thirdPost = await Post.create({
    caption: "Third post",
    image: "https://picsum.photos/800/450"
});

// Associate posts with users (set foreign key) - relationships
firstPost.setUser(rasmus);
secondPost.setUser(murat);
thirdPost.setUser(rasmus);

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

// READ all posts
app.get("/posts", async (request, response) => {
    const posts = await Post.findAll({ include: User }); // SELECT * FROM posts;
    response.json(posts); // send the posts as JSON
});

// READ one post by id
app.get("/posts/:id", async (request, response) => {
    const id = request.params.id; // use id from url
    const posts = await Post.findByPk(id, { include: User }); // SELECT * FROM posts WHERE id = id;
    response.json(posts); // send the posts as JSON
});

// READ all posts for a user
app.get("/users/:id/posts", async (request, response) => {
    const id = request.params.id; // use id from url
    const user = await User.findByPk(id, { include: Post }); // SELECT * FROM users WHERE id = id;
    response.json(user); // send the user as JSON
});

// CREATE one post for a given user
app.post("/users/:id/posts", async (request, response) => {
    const id = request.params.id; // use id from url
    const post = request.body; // use request body as post object
    const user = await User.findByPk(id); // SELECT * FROM users WHERE id = id;

    const newPost = await Post.create(post); // INSERT INTO posts (caption, image) VALUES (post.caption, post.image);
    newPost.setUser(user); // UPDATE posts SET userId = user.id WHERE id = newPost.id;
    response.json(newPost); // send the new post as JSON
});

// CREATE one post
app.post("/posts", async (request, response) => {
    const post = request.body; // use request body as post object
    const newPost = await Post.create(post); // INSERT INTO posts (caption, image) VALUES (post.caption, post.image);
    const user = await User.findByPk(post.userId); // SELECT * FROM users WHERE id = post.userId;
    await newPost.setUser(user); // UPDATE posts SET userId = user.id WHERE id = newPost.id;
    response.json(newPost); // send the new post as JSON
});

// UPDATE one post by id
app.put("/posts/:id", async (request, response) => {
    const id = request.params.id; // use id from url
    const post = request.body; // use request body as post object
    const [result] = await Post.update(post, { where: { id: id } }); // UPDATE posts SET caption = post.caption, image = post.image WHERE id = id;

    if (result) {
        response.json({ message: "Post updated" }); // send a success message as JSON
    } else {
        response.json({ message: "Post not found" }); // send a not found message as JSON
    }
});

// DELETE post by id
app.delete("/posts/:id", async (request, response) => {
    const id = request.params.id; // use id from url
    const result = await Post.destroy({ where: { id: id } }); // DELETE FROM posts WHERE id = id;

    if (result) {
        response.json({ message: "Post deleted" }); // send a success message as JSON
    } else {
        response.json({ message: "Post not found" });
    }
});

// ========== 5. Start Server  =========== //

app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
});
