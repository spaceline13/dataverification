import { spring } from 'react-router-transition';

// wrap the `spring` helper to use a bouncy config
function bounce(val) {
    return spring(val, {
        stiffness: 300,
        damping: 40,
    });
}

function mapStyles(styles) {
    return {
        opacity: styles.opacity,
        transform: `scale(${styles.scale})`,
    };
}

// child matches will...
const bounceTransition = {
    // start in a transparent, upscaled state
    atEnter: {
        opacity: 0,
        scale: 1.0,
    },
    // leave in a transparent, downscaled state
    atLeave: {
        opacity: bounce(0),
        scale: bounce(1.0),
    },
    // and rest at an opaque, normally-scaled state
    atActive: {
        opacity: bounce(1),
        scale: bounce(1),
    },
};

export { mapStyles, bounceTransition };
