export interface Navbar {
	logoPath: string;
	navButtons: NavButton[];
}

interface NavButton {
	name: string;
	path?: string;
	isVisible?: boolean;
	nestedButtons?: NavButton[];
}