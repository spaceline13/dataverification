import React from 'react';
import styled from 'styled-components';

const fontFamily = 'sans-serif';
const textColor = '#11464f';

const Text = styled.div`
    font-family: ${fontFamily};
    font-size: ${props => props.size};
    font-weight: ${props => (props.weight ? props.weight : 'inherit')}
    color: ${props => (props.color ? props.color : textColor)};
    background: ${props => (props.background ? props.background : 'transparent')};
    margin-top: ${props => props.mt};
    margin-bottom: ${props => props.mb};
    margin-left: ${props => props.ml};
    margin-right: ${props => props.mr};
    padding-top: ${props => props.pt};
    padding-bottom: ${props => props.pb};
    padding-left: ${props => props.pl};
    padding-right: ${props => props.pr};
    float: ${props => (props.right ? 'right' : 'initial')};
    display: ${props => (props.truncateLines ? '-webkit-box' : (props.inline ? 'inline' : 'block'))};
    overflow: ${props => (props.truncateLines ? 'hidden' : (props.overflow ? props.overflow : 'inherit'))};
    -webkit-line-clamp: ${props => (props.truncateLines ? props.truncateLines : 'none')};
    -webkit-box-orient: ${props => (props.truncateLines ? 'vertical' : 'none')};
    white-space: ${props => (props.nowrap ? 'nowrap' : 'normal')};
`;

const TextWithProps = props => <Text {...props} />;

export default TextWithProps;
