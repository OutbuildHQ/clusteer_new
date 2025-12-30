/**
 * Date Utility Functions
 * Provides consistent date formatting across the admin dashboard
 */

export const formatDate = (date: string | Date): string => {
	const d = typeof date === 'string' ? new Date(date) : date;
	return d.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
};

export const formatDateTime = (date: string | Date): string => {
	const d = typeof date === 'string' ? new Date(date) : date;
	return d.toLocaleString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
};

export const formatTime = (date: string | Date): string => {
	const d = typeof date === 'string' ? new Date(date) : date;
	return d.toLocaleTimeString('en-US', {
		hour: '2-digit',
		minute: '2-digit'
	});
};

export const formatRelativeTime = (date: string | Date): string => {
	const d = typeof date === 'string' ? new Date(date) : date;
	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

	if (diffInSeconds < 60) {
		return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
	}

	const diffInMinutes = Math.floor(diffInSeconds / 60);
	if (diffInMinutes < 60) {
		return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
	}

	const diffInHours = Math.floor(diffInMinutes / 60);
	if (diffInHours < 24) {
		return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
	}

	const diffInDays = Math.floor(diffInHours / 24);
	if (diffInDays < 7) {
		return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
	}

	const diffInWeeks = Math.floor(diffInDays / 7);
	if (diffInWeeks < 4) {
		return `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''} ago`;
	}

	const diffInMonths = Math.floor(diffInDays / 30);
	if (diffInMonths < 12) {
		return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
	}

	const diffInYears = Math.floor(diffInDays / 365);
	return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
};

export const formatDateRange = (startDate: string | Date, endDate: string | Date): string => {
	const start = formatDate(startDate);
	const end = formatDate(endDate);
	return `${start} - ${end}`;
};

export const isToday = (date: string | Date): boolean => {
	const d = typeof date === 'string' ? new Date(date) : date;
	const today = new Date();
	return d.toDateString() === today.toDateString();
};

export const isYesterday = (date: string | Date): boolean => {
	const d = typeof date === 'string' ? new Date(date) : date;
	const yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	return d.toDateString() === yesterday.toDateString();
};

export const formatSmartDate = (date: string | Date): string => {
	if (isToday(date)) {
		return `Today at ${formatTime(date)}`;
	}
	if (isYesterday(date)) {
		return `Yesterday at ${formatTime(date)}`;
	}
	return formatDateTime(date);
};
