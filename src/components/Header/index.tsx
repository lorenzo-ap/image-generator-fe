import { ActionIcon, Button, Text, Tooltip, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconLogout2, IconMoon, IconSun } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setUser } from '../../redux/slices/userSlice';
import { RootState, store } from '../../redux/store';
import { toastService } from '../../services/toast';
import { getColorSchemeFromLocalStorage } from '../../utils';
import ConfirmModal from '../ConfirmModal';
import SignInModal from './components/SignInModal';
import SignUpModal from './components/SignUpModal';
import styles from './index.module.scss';

const Header = () => {
  const navigate = useNavigate();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme(getColorSchemeFromLocalStorage());

  const user = useSelector((state: RootState) => state.user);

  const [signInModalOpened, { open: openSignInModal, close: closeSignInModal }] = useDisclosure(false);
  const [signUpModalOpened, { open: openSignUpModal, close: closeSignUpModal }] = useDisclosure(false);
  const [signOutConfirmModalOpened, { open: openSignOutConfirmModal, close: closeSignOutConfirmModal }] =
    useDisclosure(false);
  const [jwtToken, setJwtToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('jwt-token');
    setJwtToken(token);
  }, []);

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
  };

  const signOut = () => {
    closeSignOutConfirmModal();

    localStorage.removeItem('jwt-token');
    setJwtToken(null);
    store.dispatch(setUser(null));

    navigate('/');
    toastService.success('Signed out successfully');
  };

  return (
    <>
      <header className={`${styles.header} flex w-full items-center justify-between border-b px-4 py-5 sm:px-8`}>
        <div className='mx-auto flex w-full max-w-7xl items-center justify-between'>
          <Link to='/'>
            <Text className='group text-2xl font-semibold transition-opacity duration-150 hover:opacity-75'>
              <Text className='text-2xl font-bold' c='violet' span>
                AI
              </Text>
              nterest
            </Text>
          </Link>

          <div className='flex items-center gap-x-2'>
            {user ? (
              <Button
                component={Link}
                to={`account/${user.username}`}
                state={user}
                variant='default'
                px={10}
                radius='md'
              >
                <div className='flex h-6 w-6 items-center justify-center rounded-full bg-green-700 object-cover text-xs font-bold text-white'>
                  {user.photo ? <img className='rounded-full' src={user.photo} /> : user.username[0].toUpperCase()}
                </div>

                <Text className='ms-1.5 text-sm'>{user.username}</Text>
              </Button>
            ) : (
              <Button onClick={openSignInModal} color='cyan' variant='light' loading={!!jwtToken && !user}>
                Sign In
              </Button>
            )}

            <Tooltip withArrow label={computedColorScheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              <ActionIcon variant='default' radius='md' size={36} onClick={toggleColorScheme} aria-label='Toggle theme'>
                {computedColorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
              </ActionIcon>
            </Tooltip>

            {user && (
              <Tooltip withArrow label='Sign Out'>
                <ActionIcon
                  variant='light'
                  radius={'md'}
                  size={36}
                  color='red'
                  onClick={openSignOutConfirmModal}
                  aria-label='Sign Out'
                >
                  <IconLogout2 size={18} />
                </ActionIcon>
              </Tooltip>
            )}
          </div>
        </div>
      </header>

      <SignInModal opened={signInModalOpened} close={closeSignInModal} openSignUpModal={openSignUpModal} />
      <SignUpModal opened={signUpModalOpened} close={closeSignUpModal} openSignInModal={openSignInModal} />
      <ConfirmModal
        title='Sign Out'
        message='Are you sure you want to sign out?'
        opened={signOutConfirmModalOpened}
        confirm={signOut}
        close={closeSignOutConfirmModal}
      />
    </>
  );
};

export default Header;
