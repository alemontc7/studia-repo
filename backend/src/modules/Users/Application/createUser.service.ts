import { UserEntity } from '../Domain/user.entity';
import { userRepository } from '../Infrastructure/user.repository';

export const createUserService = async (userData: UserEntity, Adapter: userRepository = new userRepository()) => {
  // Aquí podrías añadir validaciones más avanzadas
  if (!userData.email) {
    throw new Error('Email es requerido.');
  }

  if (!userData.name) {
    throw new Error('Name es requerido.');
  }

  // Llamamos al repositorio para insertar el usuario en la BBDD
  const newUser = await Adapter.createUser(userData);
  return newUser;
}
