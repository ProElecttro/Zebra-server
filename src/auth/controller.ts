import AppDataSource from "../config";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import User from "../entities/user";

const generateAccessToken = (user: User): String => {
  const id = user.user_id;
  return jwt.sign({ id: id }, process.env.TOKEN_SECRET || "", {
    expiresIn: "20s"
  });
};

const generateRefreshToken = (user: User): String => {
  const id = user.user_id;
  return jwt.sign({ id: id }, process.env.REFRESH_TOKEN_SECRET || "");
};

let refreshTokens: any = [];

const refresh = async (req: any, res: any) => {
  const refreshToken = req.body.token;

  if (!refreshToken)
    return res.status(401).json({ message: "You are not authenticated." });
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ message: "Refresh token is not valid." });
  }
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET || "",
    (err: any, user: any) => {
      err && console.log(err);
      refreshTokens = refreshTokens.filter((token: any) => {
        token !== refreshToken;
      });
      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);

      refreshTokens.push(newRefreshToken);

      res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    }
  );
};

const login = async (req: any, res: any) => {
  const userRepo = AppDataSource.getRepository(User);

  const user = await userRepo.findOne({
    where: { email: req.body.email },
  });

  if (!user) {
    res.status(404).json({ error: "User not found, Please Register." });
  } else {
    const matchPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!matchPassword) {
      res.status(404).json({ error: "Invalid Credentials" });
    } else {
      const accessToken = generateAccessToken(user);

      res.status(200).json({
        message: "User Logged In",
        accessToken: accessToken,
      });
    }
  }
};

const register = async (req: any, res: any) => {
  const userRepo = AppDataSource.getRepository(User);

  try {
    const existingUser = await userRepo.findOne({
      where: { email: req.body.email },
    });

    if (existingUser) {
      res.status(400).json({
        message: "User already registered. Please login to your account.",
      });
    } else {
      const newUser = { ...req.body };
      const hashedPassword = await bcrypt.hash(newUser.password, 12);
      newUser.password = hashedPassword;

      const savedUser = await userRepo.save(newUser);

      res.status(201).json({
        message: "User registration successful.",
        user: savedUser,
      });
    }
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      message: "Registration failed. Please try again later.",
    });
  }
};

const logout = (req: any, res: any) => {
  return res.json({ message: "User logged out" });
};

export const controller = {
  refresh,
  login,
  register,
  logout
};