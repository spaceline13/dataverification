import React, { useRef } from 'react';
import Chip from '@material-ui/core/Chip';

export const truncateString = (string, maxLength = 50) => {
	if (!string) return null;
	const showDots = string.length > maxLength;
	return `${string.substring(0, maxLength)}${showDots ? '...' : ''}`;
};

const RestrictedLengthChip = ({ label, onDelete }) => {
	const cutLabel = truncateString(label, 30);
	const ref = useRef();
	const handleDelete = () => {
		//$(ref.current).tooltip('hide');
		onDelete();
	};

	return (
		<a
			data-placement={'top'}
			data-toggle={label.length >= 30 ? 'tooltip' : null}
			data-trigger='hover'
			title={label}
			ref={ref}
			style={{ padding: '2px' }}
		>
			<Chip
				key={label}
				tabIndex={-1}
				label={cutLabel}
				onDelete={handleDelete}
			/>
		</a>
	);
};

export default RestrictedLengthChip;
