import moment from 'moment';

const dateFormatToUser = "DD/MM/YYYY";
const dateFormatToServer = "YYYY-MM-DD";

function formatDateForUser(date) {
	return moment(date).format(dateFormatToUser);
}

function formatDateForServer(date) {
	return moment(date).format(dateFormatToServer);
}

const DateFormatter = { dateFormatToUser, dateFormatToServer, formatDateForUser, formatDateForServer };

export default DateFormatter;
