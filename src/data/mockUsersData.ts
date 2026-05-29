import { StaticImageData } from 'next/image';
import UserPhoto from '@/assets/images/user.jpg';

interface User {
  id: number;
  name: string;
  image: StaticImageData;
}

export const users: User[] = [
  {
    id: 1,
    name: 'User 1',
    image: UserPhoto,
  },
  {
    id: 2,
    name: 'User 2',
    image: UserPhoto,
  },
  {
    id: 3,
    name: 'User 3',
    image: UserPhoto,
  },
  {
    id: 4,
    name: 'User 4',
    image: UserPhoto,
  },
  {
    id: 5,
    name: 'User 5',
    image: UserPhoto,
  },
];
