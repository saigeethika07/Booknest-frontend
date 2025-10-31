import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Arial', sans-serif;
    background-color: #f5f5f5;
    line-height: 1.6;
  }

  .app {
    min-height: 100vh;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
    }
  }

  input {
    outline: none;
    border: none;
  }
`;