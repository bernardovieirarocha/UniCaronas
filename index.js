const express = require("express");
const jsonServer = require("json-server");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { Verifier } = require("academic-email-verifier");
const saltRounds = 10;

function removeSubdomainFromEmail(email) {
    // Split the email to get the local part and domain part
    let [localPart, domain] = email.split("@");

    // Split the domain into parts
    let domainParts = domain.split(".");

    // Get the last two parts of the domain
    let mainDomain = domainParts.slice(-2).join(".");

    // Construct the new email address with the main domain
    let newEmail = `${localPart}@${mainDomain}`;

    return newEmail;
}

const server = express();
const middlewares = jsonServer.defaults();
server.use(middlewares);
server.use(cors());

server.use(bodyParser.json());

const router = jsonServer.router("database.json");
const db = router.db;

server.use("/api", router);

// User Register
server.post("/user-register", async (req, res) => {
    const users = db.get("users");
    const newUser = req.body;

    if (users.find({ username: newUser.username }).value()) {
        return res.status(400).json({ message: "Username already exists" });
    }

    // BCrypt
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(newUser.password, salt);
    newUser.password = hashedPassword;

    // Default values
    newUser.id = users.size().value() + 1;
    newUser.trajetos = [];
    newUser.notaAvaliacao = {
        media: 3,
        quantidade: 1,
    };

    users.push(newUser).write();

    res.status(200).json({
        message: "User registered successfully",
        status: "success",
    });
});

// User Login
server.post("/user-login", async (req, res) => {
    const users = db.get("users");
    const credentials = req.body;

    const user = users.find({ username: credentials.username }).value();

    if (user) {
        // BCrypt
        const match = await bcrypt.compare(credentials.password, user.password);
        if (match) {
            return res.status(200).json({
                message: "Logged in successfully",
                token: user.id,
                username: user.username,
                email: user.email,
                nome: user.nome,
            });
        }
    }

    return res.status(400).json({ message: "Invalid username or password" });
});

server.get("/trajetos", (req, res) => {
    const id = parseInt(req.query.id); // Correctly retrieve id from query string
    const user = db.get("users").find({ id }).value();
    const traj_id = req.query.trajetoID;

    if (user) {
        if (traj_id) {
            const trajeto = user.trajetos.find((t) => t.id == traj_id);
            if (trajeto) {
                res.status(200).json(trajeto);
            } else {
                res.status(404).send("Trajeto not found");
            }
            return;
        } else {
            res.status(200).json(user.trajetos);
        }
    } else {
        res.status(404).send("User not found");
    }
});

server.post("/trajetos", (req, res) => {
    const id = parseInt(req.query.id); // Correctly retrieve id from query string
    const user = db.get("users").find({ id }).value();
    const trajeto = req.body;

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (trajeto) {
        user.trajetos.push(trajeto);
        db.write();
        res.status(200).json({ message: "Trajeto added successfully" });
    } else {
        res.status(400).json({ message: "Trajeto is required" });
    }
});

server.put("/trajetos", (req, res) => {
    const userid = parseInt(req.query.id); // Correctly retrieve id from query string
    const traj_id = req.query.trajetoID;
    const user = db.get("users").find({ id: userid }).value();
    const trajeto = req.body;

    if (user && user.trajetos) {
        const index = user.trajetos.findIndex((t) => t.id == traj_id);
        if (index !== -1) {
            user.trajetos[index] = trajeto;
            db.write();
            return res
                .status(200)
                .json({ message: "Trajeto updated successfully" });
        }
    }

    return res.status(404).json({ message: "User or trajeto not found" });
});

server.delete("/trajetos", (req, res) => {
    const userid = parseInt(req.query.id); // Correctly retrieve id from query string
    const traj_id = req.query.trajetoID;
    const user = db.get("users").find({ id: userid }).value();

    if (user && user.trajetos) {
        const index = user.trajetos.findIndex((t) => t.id == traj_id);
        if (index !== -1) {
            user.trajetos.splice(index, 1);
            db.write();
            return res
                .status(200)
                .json({ message: "Trajeto deleted successfully" });
        }
    }

    return res.status(404).json({ message: "User or trajeto not found" });
});

server.post("/validate-email", async (req, res) => {
    const email = req.body.email;

    console.log(email);

    if (email) {
        const emailParsed = removeSubdomainFromEmail(email);
        const isAcademic = await Verifier.isAcademic(emailParsed);
        const institutionName = await Verifier.getInstitutionName(emailParsed);
        res.status(200).json({ isAcademic, institutionName });
    } else {
        res.status(400).json({ message: "Email is required" });
    }
});
server.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});


server.listen(3000, () => {
    console.log("Server is running on port 3000");
});
