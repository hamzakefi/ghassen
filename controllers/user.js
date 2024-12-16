const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt'); 


exports.register = async (req, res) => {
  try {
    const { firstname, name, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return res
        .status(400)
        .send({ errors: [{ msg: "E-mail déjà utilisé... Réessayez" }] });
    }

    // Hacher le mot de passe avant de créer l'utilisateur
    const salt = await bcrypt.genSalt(10);  // Générer un sel pour le hachage
    const hashedPassword = await bcrypt.hash(password, salt);  // Hacher le mot de passe

    // Créer un nouvel utilisateur avec le mot de passe haché
    const newUser = new User({
      ...req.body,
      password: hashedPassword,  // Utiliser le mot de passe haché
    });

    // Sauvegarder le nouvel utilisateur
    await newUser.save();

    // Générer un token
    const token = jwt.sign(
      {
        id: newUser._id,
      },
      process.env.SCRT_KEY,
      { expiresIn: "168h" }
    );

    // Répondre avec l'utilisateur et le token
    res
      .status(200)
      .send({ success: [{ msg: "Inscription avec succès..." }], user: newUser, token });
  } catch (error) {
    res
      .status(400)
      .send({ errors: [{ msg: "Inscription non réussie..." }] });
  }
};

// *** Login ***
// *** Login ***
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe avec l'email
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res
        .status(400)
        .send({ errors: [{ msg: "Utilisateur ou E-mail non trouvé" }] });
    }

    // Vérification du mot de passe avec bcrypt
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res
        .status(400)
        .send({ errors: [{ msg: "Mot de passe incorrect" }] });
    }

    // Générer un token si le mot de passe est correct
    const token = jwt.sign(
      {
        id: foundUser._id,
        isAdmin: foundUser.isAdmin,
      },
      process.env.SCRT_KEY,
      { expiresIn: "168h" }
    );

    // Répondre avec le succès, l'utilisateur et le token
    res.status(200).send({
      success: [{ msg: "Welcome Back" }],
      user: foundUser,
      token,
    });
  } catch (error) {
    res
      .status(400)
      .send({ errors: [{ msg: "Impossible de trouver l'utilisateur !!" }] });
  }
};

// *** Update Info ***
exports.updateInfos = async (req, res) => {
  try {
    const { _id } = req.params;

    const updatedUser = await User.findOneAndUpdate(req.params, {
      $set: { ...req.body },
    });

    const token = jwt.sign(
      {
        id: updatedUser._id,
      },
      process.env.SCRT_KEY,
      { expiresIn: "168h" }
    );

    await updatedUser.save();

    res.status(200).send({
      success: [{ msg: "Mise à jour avec succès..." }],
      user: updatedUser,
      token,
    });
  } catch (error) {
    res
      .status(400)
      .send({ errors: [{ msg: "Impossible de mettre à jour... Réessayez" }] });
  }
};

// *** Update Password ***


// *** Get All Users ***
exports.getusers = async (req, res) => {
  try {
    const listusers = await User.find();
    res.status(200).send({ msg: "Users list", listusers });
  } catch (error) {
    res.status(400).send({ msg: "Cannot get all Users", error });
  }
};

// *** Get One User ***
exports.getOneUser = async (req, res) => {
  const { _id } = req.params;
  try {
    const userToGet = await User.findOne(req.params);
    res.status(200).send({ msg: "Get user", userToGet });
  } catch (error) {
    res.status(400).send({ msg: "Fail to get user", error });
  }
};