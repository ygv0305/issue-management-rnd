// Types
import type { Request, Response } from 'express';

// Models
import User from '../../models/user.js';

async function authenticateUser(email: string, password: string) {
    var user_data = await User.findOne({ email: email, password: password });
    return {user_data : user_data !== null};
}

export default authenticateUser;