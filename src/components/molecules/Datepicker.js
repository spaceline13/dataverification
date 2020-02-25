import React from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { TextField } from '@material-ui/core';

import DateFormatter from '../../utils/formatters/DateFormatter';

import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/react-datepicker-overriden.css';

const MaterialUIInput = ({ value, onClick, label }) => <TextField onClick={onClick} value={value} label={label} placeholder={'dd/mm/yy'} />;

const Datepicker = ({ filterTerms, onUserInput, showDatesFilter, noPullRight }) => {

    const handleChangeFrom = date => {
        const dateToString = date ? date.toString() : 'null';
        console.log('From date changed to:' + dateToString);
        const fterms = { ...filterTerms };
        fterms.from = date;
        onUserInput(fterms);
    };

    const handleChangeTo = date => {
        const dateToString = date ? date.toString() : 'null';
        console.log('To date changed to:' + dateToString);
        const fterms = { ...filterTerms };
        fterms.to = date;
        onUserInput(fterms);
    };

    const selectDateRange = date => {
        const fterms = { ...filterTerms };
        fterms.from = date;
        fterms.to = null;
        onUserInput(fterms);
    };

    const isMobileOrTablet = window.matchMedia('only screen and (max-width: 1024px)');
    return (
		<div className={noPullRight ? '' : 'pull-right-desktop'} style={{ width: '100%' }}>
			<form style={{ display: 'flex', justifyContent: 'space-between' }}  style={{ width: '100%' }}>
				{showDatesFilter
					? [
						  <div key="from-div" style={{ width: '50%', display: 'inline-block', paddingRight: '5px' }}>
							  <DatePicker
								  id="dateFrom"
								  className="datepicker-foodakai"
								  selected={filterTerms.from ? moment(filterTerms.from) : null}
								  onChange={handleChangeFrom}
								  minDate={moment('1980-01-01')}
								  maxDate={filterTerms.to ? moment(filterTerms.to) : moment(new Date())}
								  dateFormat={DateFormatter.dateFormatToUser}
								  isClearable={true}
								  showMonthDropdown
								  showYearDropdown
								  dropdownMode="select"
								  popperPlacement="bottom"
								  shouldCloseOnSelect
								  withPortal={isMobileOrTablet.matches}
								  customInput={<MaterialUIInput label={'From'} />}
							  />
						  </div>,
						  <div key="to-div" style={{ width: '50%', display: 'inline-block', paddingRight: '5px' }}>
							  <DatePicker
								  id="dateFrom"
								  className="datepicker-foodakai"
								  selected={filterTerms.to ? moment(filterTerms.to) : null}
								  onChange={handleChangeTo}
								  minDate={filterTerms.from ? moment(filterTerms.from) : moment('1980-01-01')}
								  maxDate={moment(new Date())}
								  dateFormat={DateFormatter.dateFormatToUser}
								  isClearable={true}
								  showMonthDropdown
								  showYearDropdown
								  dropdownMode="select"
								  popperPlacement="bottom-end"
								  popperModifiers={{
									  preventOverflow: {
										  enabled: true,
										  escapeWithReference: false, // force popper to stay in viewport (even when input is scrolled out of view)
										  boundariesElement: 'window',
									  },
								  }}
								  shouldCloseOnSelect
								  withPortal={isMobileOrTablet.matches}
								  customInput={<MaterialUIInput label={'To'} />}
							  />
						  </div>,
					  ]
					: null}
			</form>
		</div>
    );
};

export default Datepicker;
