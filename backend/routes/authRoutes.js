const CryptoJS = require("crypto-js");
const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require("../models");

const router = express.Router();

// ÎNREGISTRARE
router.post("/inregistrare", async (req, res) => {
  try {
    const { firstName, lastName, password, email } = req.body;
    const newUser = await User.create({
      firstName, lastName,
      password: CryptoJS.AES.encrypt(
        password,
        "kokokokok"
      ).toString(), email
    });
    const savedUser = await newUser.save();
    return res.status(200).json(savedUser);

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'A intervenit o eroare în timpul creării utilizatorului.' + err });
  }
});

// AUTENTIFICARE
router.post("/autentificare", async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(401).json({ message: "Nu există un astfel de utilizator!" });
    }
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      "kokokokok"
    );
    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    if (OriginalPassword !== req.body.password) {
      return res.status(401).json({ message: "Parolă greșită!" });
    }

    const accessToken = jwt.sign(
      {
        user
      },
      "kokokokok",
      { expiresIn: "3d" }
    );
    return res.status(200).json({ accessToken });
  } catch (err) {
    console.error(err.message)
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;