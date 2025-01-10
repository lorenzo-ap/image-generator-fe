import { Button, CloseButton, Text, TextInput, Title, Tooltip } from '@mantine/core';
import { IconArrowRight, IconPhotoAi } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import useSearchPosts from '../../hooks/useSearchPosts';
import { RootState } from '../../redux/store';
import { postService } from '../../services/post';
import RenderCards from '../Home/components/RenderCards';
import ProfileAvatar from './components/ProfileAvatar';

const ProfilePage = () => {
  const location = useLocation();
  const stateUser = useMemo(() => location.state, [location.state]);

  const user = useSelector((state: RootState) => state.user);
  const posts = useSelector((state: RootState) => state.posts.userPosts);

  const { searchText, searchedPosts, handleSearchChange, resetSearch } = useSearchPosts(posts);

  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = stateUser.username;

    setIsCurrentUser(user?._id === stateUser._id);
    setLoading(true);

    postService
      .getUserPosts(stateUser._id)
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [user, stateUser._id, stateUser.username]);

  return (
    <>
      <div className='relative mx-auto max-w-7xl'>
        <div className='mb-5 flex flex-wrap items-center justify-between gap-y-5'>
          <div className='flex items-center gap-x-3'>
            <ProfileAvatar user={user} stateUser={stateUser} isCurrentUser={isCurrentUser} />

            <div>
              <Title>{stateUser.username}</Title>
              {isCurrentUser && <Text opacity={0.5}>{user?.email}</Text>}
            </div>
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

        <TextInput
          className='m5-4 md:mt-8'
          flex={1}
          size='md'
          radius='md'
          label='Search posts'
          placeholder='Enter prompt'
          disabled={loading}
          value={searchText}
          onChange={handleSearchChange}
          rightSection={
            searchText && (
              <Tooltip withArrow label='Clear'>
                <CloseButton onClick={resetSearch} />
              </Tooltip>
            )
          }
        />

        <div className='mt-3'>
          {searchText && (
            <Title className='mb-3 font-medium' order={2} size={'h3'}>
              <span className='opacity-60'>Showing results for</span> <span className='opacity-100'>{searchText}</span>
            </Title>
          )}

          <div className='grid grid-cols-1 gap-3 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'>
            {searchText ? (
              <RenderCards posts={searchedPosts} title='No search results found' loading={loading} />
            ) : (
              <RenderCards posts={posts} title='No posts found' loading={loading} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
