import { UserEntity } from '../Domain/user.entity';
import { userRepository } from '../Infrastructure/user.repository';

export const createUserService = async (userData: UserEntity, Adapter: userRepository = new userRepository()) => {
  if (!userData.email) {
    throw new Error('Email es requerido.');
  }

  if (!userData.name) {
    throw new Error('Name es requerido.');
  }

  const newUser = await Adapter.createUser(userData);
  return newUser;
}
