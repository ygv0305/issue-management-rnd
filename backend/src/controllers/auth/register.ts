// Types
import type { Request, Response } from 'express';
import type { IUser } from '../../models/user.js';

// Models
import User from '../../models/user.js';

type RegisterData = Pick<IUser, 'email' | 'password'>;

const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as RegisterData;
  try {
    const newUser = await User.create({
      email,
      password,
    });

    res.status(201).json({
      user: {
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });
  }
};

export default register;
