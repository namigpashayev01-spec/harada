import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { users } from '@/data/mockUsersData';

const OurSiteUsers = () => {
  return (
    <div className="absolute top-5 left-5 md:top-[36px] z-40 md:left-[36px]">
      <div className="flex flex-col items-center gap-2">
        <div className="flex mr-auto -space-x-2">
          {users.map((user) => (
            <Avatar
              key={user.id}
              className="md:w-10 -mr-4  h-8 w-8 md:h-10 border-2 border-[#6b7c57] rounded-full overflow-hidden">
              <AvatarImage
                className="object-cover"
                src={
                  typeof user.image === 'string' ? user.image : user.image.src
                }
                alt={user.name}
              />
              <AvatarFallback >
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
        <p className="text-white text-[12px] md:text-sm font-medium">
          2k+ People use our website
        </p>
      </div>
    </div>
  );
};

export default OurSiteUsers;
