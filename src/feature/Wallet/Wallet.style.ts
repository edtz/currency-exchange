import styled, { css } from 'styled-components';

export const SelectorContainer = styled.nav`
    display: flex;
`;

export const SelectorItem = styled.div<{ active: boolean }>`
    font-size: 3rem;
    position: relative;
    margin-right: 2rem;
    padding-bottom: 1rem;
    opacity: 0.6;
    word-spacing: 0.3em;
    transition: opacity 200ms ease-out, transform 200ms ease-out;
    cursor: pointer;
    span {
        font-size: 0.75rem;
        position: absolute;
        bottom: 0.4rem;
        left: 0.2rem;
    }
    &:hover {
        opacity: 1;
    }
    ${({ active }) =>
        active &&
        css`
            opacity: 0.9;
            transform: scale(1.15);
        `}
`;

export const Header = styled.header<{ isHidden?: boolean }>`
    text-transform: uppercase;
    margin: 0.6rem 0 -0.3rem 0rem;
    opacity: ${({ isHidden }) => (isHidden ? 0 : 1)};
`;
