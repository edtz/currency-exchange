import styled from 'styled-components';

export const Button = styled.button`
    background: none;
    border: 3px solid rgba(255, 255, 255, 0.6);
    padding: 0.6rem;
    color: inherit;
    font-size: 2rem;
    width: 100%;
    margin: 0.5rem 0 0.2rem;
    transition: all .2s ease-out;
    &:hover {
        background-color: white;
        color: gray;
    }
`;
