import { ActionIcon, Button, Text, Tooltip, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconLogout, IconMoon, IconSun } from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setUser } from '../../redux/slices/userSlice';
import { RootState, store } from '../../redux/store';
import { getColorSchemeFromLocalStorage } from '../../utils';
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

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
    document.body.style.background =
      computedColorScheme === 'dark' ? 'var(--mantine-color-gray-0)' : 'var(--mantine-color-dark-7)';
    document.body.style.color =
      computedColorScheme === 'dark' ? 'var(--mantine-color-black)' : 'var(--mantine-color-dark-0)';
  };

  const signOut = () => {
    localStorage.removeItem('jwt-token');
    store.dispatch(setUser(null));
    navigate('/');
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

          <div className='flex items-center gap-x-4'>
            {!user ? (
              <Button onClick={openSignInModal} color='cyan' variant='light'>
                Sign In
              </Button>
            ) : (
              <Tooltip withArrow label='Sign Out'>
                <ActionIcon
                  variant='light'
                  radius={'md'}
                  size={36}
                  color='cyan'
                  onClick={signOut}
                  aria-label='Sign Out'
                >
                  <IconLogout size={18} />
                </ActionIcon>
              </Tooltip>
            )}

            <Tooltip withArrow label={computedColorScheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              <ActionIcon
                variant='default'
                radius={'md'}
                size={36}
                onClick={toggleColorScheme}
                aria-label='Toggle theme'
              >
                {computedColorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
              </ActionIcon>
            </Tooltip>
          </div>
        </div>
      </header>

      <SignInModal opened={signInModalOpened} close={closeSignInModal} openSignUpModal={openSignUpModal} />
      <SignUpModal opened={signUpModalOpened} close={closeSignUpModal} openSignInModal={openSignInModal} />
    </>
  );
};

export default Header;
