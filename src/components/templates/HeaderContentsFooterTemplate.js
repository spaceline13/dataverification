import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box/Box';
import { useSelector } from 'react-redux';

import Stepper from '../organisms/Stepper';
import Footer_StepController_Validator from '../organisms/Footer_StepController_Validator';
import StepTitle from '../molecules/StepTitle';
import StepSubtitle from '../molecules/StepSubtitle';
import Infobox from '../molecules/Infobox';
import MiddleScreenContainer from '../molecules/MiddleScreenContainer';
import { getActiveStep } from '../../redux/selectors/stepsSelectors';

const HeaderContentsFooterTemplate = ({ children, onBack, onNext, onFinish }) => {
    const { title, subtitle, infobox } = useSelector(getActiveStep);
    return (
        <Box display={'flex'} flexDirection={'column'} height={'100%'} overflow={'hidden'}>
            <Box flex={'0 0 auto'}>
                <Stepper />
            </Box>
            <Box flex={'1 1 auto'} height={'100%'} overflow={'auto'}>
                <MiddleScreenContainer>
                    <StepTitle title={title} />
                    <StepSubtitle subtitle={subtitle} />
                    {children}
                    {infobox && (
                        <Infobox>
                            <span>{infobox}</span>
                        </Infobox>
                    )}
                </MiddleScreenContainer>
            </Box>
            <Box flex={'0 0 auto'}>
                <Footer_StepController_Validator onBack={onBack} onNext={onNext} onFinish={onFinish} />
            </Box>
        </Box>
    );
};
HeaderContentsFooterTemplate.propTypes = {
    children: PropTypes.node,
    onBack: PropTypes.func,
    onNext: PropTypes.func,
    onFinish: PropTypes.func,
};

export default HeaderContentsFooterTemplate;
