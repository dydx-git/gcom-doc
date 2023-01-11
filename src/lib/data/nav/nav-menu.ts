import type { Navbar } from "$lib/models/navbar";

const navbar: Navbar = {
	logoPath: '',
	navButtons: [
		{ name: 'Home', path: '/' },
		{ name: 'Orders', path: '/order' },
		{ name: 'Clients', path: '/client' },
		{ name: 'Revenue + Stats', path: '/stats' },
		{
			name: 'Templates',
			nestedButtons: [
				{ name: 'Email Templates', path: '/template/email' },
				{ name: 'Call Scripts', path: '/template/call' }
			]
		}
	]
};

export default navbar;
