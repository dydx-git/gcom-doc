export type UserSettings = {
	theme: string;
	datatable: {
		order: {
			showRecordsForLastDays: number;
		};
	};
};

export const userPreferences: UserSettings = {
	theme: 'light',
	datatable: {
		order: {
			showRecordsForLastDays: 40
		}
	}
};
