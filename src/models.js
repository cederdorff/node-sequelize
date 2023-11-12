import { DataTypes } from "sequelize";
import sequelize from "./database.js";

// ========== Define Models =========== //
// Define user model
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

// Define post model
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

// ========== Define Associations/ Relationships =========== //
// Define the association
User.belongsToMany(Post, { through: "postsUsers" }); // Many-to-many relationship between User and Post
Post.belongsToMany(User, { through: "postsUsers" }); // Many-to-many relationship between Post and User

// ========== Synchronize Models with Database =========== //

// to automatically synchronize all models
// For development/testing purposes only.
// Drops and recreates tables.
await sequelize.sync({ force: true });

// ========== Create Test Data =========== //

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
// Sample post 1
const firstPost = await Post.create({
    caption: "First post",
    image: "https://picsum.photos/800/450"
});

// Sample post 2
const secondPost = await Post.create({
    caption: "Second post",
    image: "https://picsum.photos/800/450"
});

// Sample post 3
const thirdPost = await Post.create({
    caption: "Third post",
    image: "https://picsum.photos/800/450"
});

// Add users to posts (many-to-many relationships)
firstPost.addUser(rasmus); // Add user 1 to post 1
firstPost.addUser(anne); // Add user 2 to post 1
secondPost.addUser(murat); // Add user 3 to post 2
secondPost.addUser(anne); // Add user 2 to post 2
thirdPost.addUser(rasmus); // Add user 1 to post 3
thirdPost.addUser(murat); // Add user 3 to post 3
thirdPost.addUser(anne); // Add user 2 to post 3
