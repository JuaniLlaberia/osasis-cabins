import { useDarkMode } from '../context/DarkModeConext';
import ButtonIcon from './ButtonIcon';
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi2';

export const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <ButtonIcon onClick={toggleDarkMode}>
      {isDarkMode ? <HiOutlineSun /> : <HiOutlineMoon />}
    </ButtonIcon>
  );
};
