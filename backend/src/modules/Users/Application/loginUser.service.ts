import { LoginDTO } from '../Domain/login.dto';
import { userRepository } from '../Infrastructure/user.repository';
import { UserEntity } from '../Domain/user.entity';

export const loginUserService = async (userData: LoginDTO, Adapter: userRepository = new userRepository()):Promise<UserEntity> => {
  if (!userData.email) {
    throw new Error('Email es requerido.');
  }

  if (!userData.password) {
    throw new Error('Password es requerido.');
  }

  const user = await Adapter.findByEmailAndPassword(userData);

  if (!user) {
    throw new Error('Invalid email or password.');
  }
  return user;
}
