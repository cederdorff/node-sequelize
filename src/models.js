import { DataTypes } from "sequelize";
import sequelize from "./database.js";

// ========== 1. Define Models =========== //
export const User = sequelize.define("user", {
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

export const Post = sequelize.define("post", {
    // Post model attributes
    caption: {
        type: DataTypes.STRING,
        allowNull: false // Title is required
    },
    image: {
        type: DataTypes.TEXT
    }
});

// ========== 1.1 Define Associations =========== //
// Define the association
User.belongsToMany(Post, { through: "postsUsers" }); // Many-to-many relationship between User and Post
Post.belongsToMany(User, { through: "postsUsers" }); // Many-to-many relationship between Post and User

// ========== 2. Synchronize Models with Database =========== //

// to automatically synchronize all models
// For development/testing purposes only.
// Drops and recreates tables.
await sequelize.sync({ force: true });

// ========== 3. Create Test Data =========== //

// For development/testing purposes only.
// Creates sample user data in the database.

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

const firstPost = await Post.create({
    caption: "First post",
    image: "https://picsum.photos/800/450"
});

firstPost.addUser(rasmus);
firstPost.addUser(anne);

const secondPost = await Post.create({
    caption: "Second post",
    image: "https://picsum.photos/800/450"
});

secondPost.addUser(murat);
secondPost.addUser(anne);

const thirdPost = await Post.create({
    caption: "Third post",
    image: "https://picsum.photos/800/450"
});

thirdPost.addUser(rasmus);
thirdPost.addUser(murat);
thirdPost.addUser(anne);
