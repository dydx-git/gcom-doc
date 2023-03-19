export type UserSettings = {
	theme: string;
	datatable: {
		order: {
			showRecordsForLastDays: number;
		};
	};
	inputToProcessDelay: number;
};

export const userPreferences: UserSettings = {
	theme: 'light',
	datatable: {
		order: {
			showRecordsForLastDays: 40
		}
	},
	inputToProcessDelay: 500
};
