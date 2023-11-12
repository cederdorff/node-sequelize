import { Router } from "express"; // import the express Router
import { User, Post } from "./models.js"; // import the models

export const router = Router(); // create a new router

// ========== Routes  =========== //

// READ - Root endpoint
router.get("/", (request, response) => {
    response.send("Node REST API Running 🎉");
});

// READ all users
router.get("/users", async (request, response) => {
    const users = await User.findAll(); // SELECT * FROM users;
    response.json(users); // send the users as JSON
});

// READ one user by id
router.get("/users/:id", async (request, response) => {
    const id = request.params.id; // use id from url
    const users = await User.findByPk(id); // SELECT * FROM users WHERE id = id;
    response.json(users); // send the users as JSON
});

// CREATE one user
router.post("/users", async (request, response) => {
    const user = request.body; // use request body as user object
    const newUser = await User.create(user); // INSERT INTO users (name, title, mail, image) VALUES (user.name, user.title, user.mail, user.image);
    response.json(newUser); // send the new user as JSON
});

// UPDATE one user by id
router.put("/users/:id", async (request, response) => {
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
router.delete("/users/:id", async (request, response) => {
    const id = request.params.id; // use id from url
    const result = await User.destroy({ where: { id: id } }); // DELETE FROM users WHERE id = id;

    if (result) {
        response.json({ message: "User deleted" }); // send a success message as JSON
    } else {
        response.json({ message: "User not found" }); // send a not found message as JSON
    }
});

// READ all posts
router.get("/posts", async (request, response) => {
    const posts = await Post.findAll({ include: User }); // SELECT * FROM posts;
    response.json(posts); // send the posts as JSON
});

// READ one post by id
router.get("/posts/:id", async (request, response) => {
    const id = request.params.id; // use id from url
    const posts = await Post.findByPk(id, { include: User }); // SELECT * FROM posts WHERE id = id;
    response.json(posts); // send the posts as JSON
});

// READ all posts for a user
router.get("/users/:id/posts", async (request, response) => {
    const id = request.params.id; // use id from url
    const user = await User.findByPk(id, { include: Post }); // SELECT * FROM users WHERE id = id;
    response.json(user); // send the user as JSON
});

// CREATE one post for a given user
router.post("/users/:id/posts", async (request, response) => {
    const id = request.params.id; // use id from url
    const post = request.body; // use request body as post object
    const user = await User.findByPk(id); // SELECT * FROM users WHERE id = id;

    const newPost = await Post.create(post); // INSERT INTO posts (caption, image) VALUES (post.caption, post.image);
    newPost.setUser(user); // UPDATE posts SET userId = user.id WHERE id = newPost.id;
    response.json(newPost); // send the new post as JSON
});

// CREATE one post
router.post("/posts", async (request, response) => {
    const post = request.body; // use request body as post object
    const newPost = await Post.create(post); // INSERT INTO posts (caption, image) VALUES (post.caption, post.image);
    response.json(newPost); // send the new post as JSON
});

// UPDATE one post by id
router.put("/posts/:id", async (request, response) => {
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
router.delete("/posts/:id", async (request, response) => {
    const id = request.params.id; // use id from url
    const result = await Post.destroy({ where: { id: id } }); // DELETE FROM posts WHERE id = id;

    if (result) {
        response.json({ message: "Post deleted" }); // send a success message as JSON
    } else {
        response.json({ message: "Post not found" });
    }
});
