import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import dayjs from 'dayjs';
import { Jobs } from '$lib/modules/order/order';

export const GET: RequestHandler = async (req) => {
	const { url } = req;
	const showRecordsForLastDays = Number(url.searchParams.get('showRecordsForLastDays'));

	if (!showRecordsForLastDays) throw error(400, 'Missing parameter: showRecordsForLastDays');

	const dateUntil = dayjs().subtract(showRecordsForLastDays, 'day').toDate();

	const jobs = new Jobs();
	const data = await jobs.read(dateUntil);

	return json(data);
};
