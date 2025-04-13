import { LoginDTO } from '../Domain/login.dto';
import { userRepository } from '../Infrastructure/user.repository';
import { UserEntity } from '../Domain/user.entity';

export const findUserService = async (email: string, Adapter: userRepository = new userRepository()):Promise<UserEntity> => {
  if (!email) {
    throw new Error('Email es requerido.');
  }
  const user = await Adapter.findByEmail(email);
  if (!user) {
    throw new Error('Email does not exist');
  }
  return user;
}
