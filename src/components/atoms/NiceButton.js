import styled from 'styled-components';

const NiceButton = styled.a`
    display:inline-block;
    padding: 0.1em 0.4em;
    margin-left: 4px;
    border: 1px solid ${props => props.borderColor ? props.borderColor : '#84a3bd'};
    cursor: pointer;
    border-radius: 2em;
    box-sizing: border-box;
    text-decoration:none;
    font-weight:300;
    color:#565656;
    background-color: ${props => props.backgroundColor ? props.backgroundColor : '#d9edff'};
    text-align:center;
    transition: all 0.2s;
    &:hover{
        background-color: ${props => props.hoverColor ? props.hoverColor : '#4095c6'};
        color: #FFFFFF;
    }
`;

export default NiceButton;
