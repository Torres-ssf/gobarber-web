import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  > header {
    height: 144px;
    background: #28262e;
    display: flex;
    align-items: center;

    div {
      width: 100%;
      max-width: 1120px;
      margin: 0 auto;

      svg {
        color: #999591;
        height: 24px;
        width: 24px;
        margin-left: 18px;
      }
    }
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: -176px auto 0;
  width: 100%;

  form {
    margin: 80px 0;
    width: 340px;
    display: flex;
    flex-direction: column;

    h1 {
      margin-bottom: 24px;
      font-size: 1.4rem;
      text-align: left;
    }

    a {
      color: #f4ede8;
      display: block;
      margin-top: 24px;
      text-decoration: none;
      transition: color 0.2s;

      &:hover {
        color: ${shade(0.2, '#f4ede8')};
      }
    }

    div:nth-last-of-type(3) {
      margin-top: 24px;
    }
  }
`;

export const AvatarInput = styled.div`
  align-self: center;
  margin-bottom: 32px;
  position: relative;

  img {
    height: 186px;
    width: 186px;
    border-radius: 50%;
  }

  label {
    background: #ff8000;
    border: none;
    border-radius: 50%;
    position: absolute;
    cursor: pointer;
    bottom: 0;
    right: 0;
    height: 48px;
    width: 48px;
    transition: background 0.3s;

    display: flex;
    align-items: center;
    justify-content: center;

    input {
      display: none;
    }

    svg {
      width: 20px;
      height: 20px;
      color: #312e48;
    }

    &:hover {
      background: ${shade(0.2, '#ff9000')};
    }
  }
`;
