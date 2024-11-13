const User = require("../model/User");
const jwt = require("jsonwebtoken");

// *** Register ***
exports.register = async (req, res) => {
  try {
    const { firstname, name, email, password } = req.body;

    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return res
        .status(400)
        .send({ errors: [{ msg: "E-mail déjà utilisé... Réessayez" }] });
    }

    const newUser = new User({ ...req.body });

    // save
    await newUser.save();

    // token
    const token = jwt.sign(
      {
        id: newUser._id,
      },
      process.env.SCRT_KEY,
      { expiresIn: "168h" }
    );
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
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check email existence
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res
        .status(400)
        .send({ errors: [{ msg: "Utilisateur ou E-mail non trouvé" }] });
    }

    // token
    const token = jwt.sign(
      {
        id: foundUser._id,
        isAdmin: foundUser.isAdmin,
      },
      process.env.SCRT_KEY,
      { expiresIn: "168h" }
    );
    res.status(200).send({ success: [{ msg: "Welcome Back" }], user: foundUser, token });
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
