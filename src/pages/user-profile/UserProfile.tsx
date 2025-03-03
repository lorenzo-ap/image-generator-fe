import { Badge, Button, Skeleton, Text, Title } from '@mantine/core';
import { IconArrowRight, IconPhotoAi } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getUserByUsername } from '../../api';
import { RenderCards, ScrollToTopButton, Sort } from '../../components';
import { useSearchPosts } from '../../hooks';
import { setUserPosts } from '../../redux/slices';
import { RootState } from '../../redux/store';
import { postService } from '../../services/posts';
import { User, UserRole } from '../../types';
import { SearchPostsInput } from '../components';
import { UserProfileAvatar } from './components/UserProfileAvatar';

export const UserProfilePage = () => {
  const params = useParams();

  const loggedUser = useSelector((state: RootState) => state.user);
  const userPosts = useSelector((state: RootState) => state.posts.userPosts.posts);

  const { searchText, searchedPosts, handleSearchChange, resetSearch } = useSearchPosts(userPosts);

  const [user, setUser] = useState<User | null>(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setUserLoading(true);

    getUserByUsername(params.username || '')
      .then((res) => {
        const user = res.data;
        document.title = user.username;

        setUser(user);
        setIsCurrentUser(loggedUser?._id === user._id);
        setPostsLoading(true);

        postService.setUserPosts(user._id).finally(() => setPostsLoading(false));
      })
      .finally(() => setUserLoading(false));
  }, [loggedUser, params.username]);

  return (
    <>
      <div className='relative mx-auto max-w-7xl'>
        <div className='mb-5 flex flex-wrap items-center justify-between gap-y-5'>
          <div className='flex items-center gap-x-3'>
            {userLoading ? (
              <Skeleton height={82} circle />
            ) : (
              <UserProfileAvatar user={user} isCurrentUser={isCurrentUser} />
            )}

            {userLoading ? (
              <div className='space-y-2'>
                <Skeleton height={24} width={150} radius='sm' />
                <Skeleton height={16} width={200} radius='sm' />
              </div>
            ) : (
              <div>
                <div className='flex items-center gap-2'>
                  <Title>{user?.username}</Title>

                  {user?.role === UserRole.ADMIN && (
                    <Badge color='violet' variant='light' size='md' radius='xl' className='font-semibold uppercase'>
                      Admin
                    </Badge>
                  )}
                </div>

                {isCurrentUser && <Text opacity={0.5}>{loggedUser?.email}</Text>}
              </div>
            )}
          </div>

          {isCurrentUser && (
            <div className='flex gap-x-3'>
              <Button
                className='transition-opacity duration-75 hover:opacity-90'
                component={Link}
                to='/generate-image'
                variant='gradient'
                gradient={{ from: 'violet', to: 'blue', deg: 90 }}
                size='lg'
                rightSection={<IconArrowRight size={20} />}
                leftSection={<IconPhotoAi size={20} />}
              >
                Generate image
              </Button>
            </div>
          )}
        </div>

        {postsLoading ? (
          <Skeleton radius='md' height={42} className='mt-11 md:mt-14' />
        ) : (
          !!userPosts.length && (
            <div className='mt-4 flex items-end gap-x-2 md:mt-8'>
              <SearchPostsInput
                placeholder='Enter prompt'
                loading={postsLoading}
                searchText={searchText}
                handleSearchChange={handleSearchChange}
                resetSearch={resetSearch}
              />

              <Sort posts={searchText ? searchedPosts : userPosts} setPosts={setUserPosts} />
            </div>
          )
        )}

        <div className='mt-3'>
          {searchText && (
            <Title className='mb-3 font-medium' order={2} size={'h3'}>
              <span className='opacity-60'>Showing results for</span> <span className='opacity-100'>{searchText}</span>
            </Title>
          )}

          <RenderCards title='No posts found' posts={searchText ? searchedPosts : userPosts} loading={postsLoading} />
        </div>
      </div>

      <ScrollToTopButton />
    </>
  );
};
