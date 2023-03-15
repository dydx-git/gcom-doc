interface Navbar {
	logoPath: string;
	navButtons: NavButton[];
}

interface NavButton {
	name: string;
	path?: string;
	isVisible?: boolean;
	nestedButtons?: NavButton[];
}

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
