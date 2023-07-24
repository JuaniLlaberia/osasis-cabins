import { styled } from 'styled-components';

const Input = styled.input`
  background-color: var(--color-gray-0);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-md);
  padding: 0.8rem 1.2rem;

  &::-webkit-calendar-picker-indicator {
    /* width: 100%; */
    /* padding-right: 35rem;
    opacity: 0; */
  }
`;

export default Input;
