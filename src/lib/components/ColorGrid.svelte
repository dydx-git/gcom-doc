<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import ColorButton from './ColorButton.svelte';
	/**
	 * Converts hex color to HSL
	 *
	 * @param {string} H - The hex color string either in the format of '#RRGGBB' or '#RGB'
	 * @returns {{ h: number, s: number, l: number }} - The HSL object, where s and l
	 * are percentages.
	 */
	function hexToHSL(H: string) {
		// Convert hex to RGB first
		let r = 0,
			g = 0,
			b = 0;
		if (H.length == 4) {
			r = Number('0x' + H[1] + H[1]);
			g = Number('0x' + H[2] + H[2]);
			b = Number('0x' + H[3] + H[3]);
		} else if (H.length == 7) {
			r = Number('0x' + H[1] + H[2]);
			g = Number('0x' + H[3] + H[4]);
			b = Number('0x' + H[5] + H[6]);
		}
		// Then to HSL
		r /= 255;
		g /= 255;
		b /= 255;
		let cmin = Math.min(r, g, b),
			cmax = Math.max(r, g, b),
			delta = cmax - cmin,
			h = 0,
			s = 0,
			l = 0;

		if (delta == 0) h = 0;
		else if (cmax == r) h = ((g - b) / delta) % 6;
		else if (cmax == g) h = (b - r) / delta + 2;
		else h = (r - g) / delta + 4;

		h = Math.round(h * 60);

		if (h < 0) h += 360;

		l = (cmax + cmin) / 2;
		s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
		s = +(s * 100).toFixed(1);
		l = +(l * 100).toFixed(1);

		return {
			h,
			s,
			l
		};
	}

	interface hslType {
		h: number;
		s: number;
		l: number;
	}

	/**
	 * Converts HSL color to its Hex string
	 *
	 * @param {{ h: number; s: number; l: number }} hsl - An object with the hue,
	 * saturation and lightness values
	 * @returns {string} The hex string in the format of '#RRGGBB'
	 */
	function HSLToHex(hsl: hslType) {
		let { h, s, l } = hsl;
		l /= 100;
		const a = (s * Math.min(l, 1 - l)) / 100;
		const f = (n: number) => {
			const k = (n + h / 30) % 12;
			const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
			return Math.round(255 * color)
				.toString(16)
				.padStart(2, '0'); // convert to Hex and prefix "0" if needed
		};
		return `#${f(0)}${f(8)}${f(4)}`;
	}

	/**
	 * This function returns an array of color strings where each color has a
	 * relation with the input color.
	 *
	 * @param {string} color The hex color string "#RRGGBB"
	 * @param {number} at The position of the color in the swatches
	 * @returns {string[]} An array of hex color strings.
	 */
	function swatches(color: string, at = 6) {
		const c = Number('0x' + color.slice(1));
		const { h, s, l } = hexToHSL(color);
		const rndSeed = c / 0xffffff;
		const rnd = Math.round(rndSeed * 5);

		/**
		 * Gets a distance (in number) from the current color and its closest gray
		 * @returns number A distance from the current color and its gray
		 */
		const grayDist = () => {
			// To get the closest gray, the current color saturation is set to 0
			const grayHex = HSLToHex({ h, s: 0, l });
			const gray = Number('0x' + grayHex.slice(1));
			// Decompose the closest gray into RGB number values
			const rGray = (gray >> 16) & 0x0000ff;
			const gGray = (gray >> 8) & 0x0000ff;
			const bGray = gray & 0x0000ff;
			// Decompose the current color into RGB number values
			const r = (c >> 16) & 0x0000ff;
			const g = (c >> 8) & 0x0000ff;
			const b = c & 0x0000ff;
			// Return their absolute difference.
			return Math.abs(rGray - r) + Math.abs(gGray - g) + Math.abs(bGray - b);
		};

		const saturationValues = () => {
			// The sat amount to represent
			const range = Math.min(64, grayDist());
			let weakest = 0;
			let strongest = 100;
			if (s > 50) {
				strongest = Math.min(s + range / 2, 100);
				weakest = strongest - range;
			} else {
				weakest = Math.max(s - range / 2, 0);
				strongest = weakest + range;
			}
			const increment = (strongest - weakest) / 5;
			let rightValue = weakest + Math.abs((weakest + increment - (strongest - increment * 3)) / 2);
			let leftValue = Math.abs((strongest - increment + (weakest + increment * 3)) / 2);
			rightValue = rightValue > strongest - increment * 4 ? strongest : rightValue;
			leftValue = leftValue < weakest + increment * 4 ? weakest + increment * 4 : leftValue;

			const values = [
				weakest + increment * 1,
				rightValue,
				weakest,
				weakest + increment * 3,
				weakest + increment * 4,
				weakest + increment * 2,
				s,
				strongest - increment * 2,
				strongest - increment * 4,
				strongest - increment * 3,
				strongest,
				leftValue,
				strongest - increment * 1
			];
			return values;
		};

		const isGray =
			color[1] === color[3] &&
			color[3] === color[5] &&
			color[2] === color[4] &&
			color[4] === color[6];
		const lightnessValues = () => {
			// The light amount to represent
			let range = isGray ? 64 : Math.min(50, grayDist()) + 1;
			let darkest = 0;
			let lightest = 100;

			let rangeRatio = 0.5;
			if (l >= 50) {
				const distanceToMax = 100 - l;
				rangeRatio = Math.min(1 / (range / distanceToMax) - 0.1, rangeRatio);
				lightest = Math.min(l + range * rangeRatio, 100);
				darkest = l - range / 2;
			} else {
				const distanceToMin = l;
				rangeRatio = Math.min(1 - distanceToMin / range - 0.1, rangeRatio);
				darkest = Math.max(l - range * rangeRatio, 0);
				lightest = l + range / 2;
			}
			range = lightest - darkest;
			const increment = (lightest - darkest) / 5;
			let rightValue = darkest + Math.abs((darkest + increment - (lightest - increment * 3)) / 2);
			let leftValue = Math.abs((lightest - increment + (darkest + increment * 3)) / 2);
			rightValue = rightValue > lightest - increment * 4 ? lightest : rightValue;
			leftValue = leftValue < darkest + increment * 4 ? darkest + increment * 4 : leftValue;

			const values = [
				darkest,
				darkest + increment * 2,
				darkest + increment * 1,
				rightValue,
				darkest + increment * 4,
				darkest + increment * 3,
				l,
				lightest - increment * 3,
				lightest - increment * 4,
				leftValue,
				lightest - increment * 1,
				lightest - increment * 2,
				lightest
			];
			return values;
		};

		const hueValues = () => {
			const A = rnd;
			const B = -118;
			const C = 34;
			const D = Math.round(B / 2 - A);
			const E = Math.round(-D / 4 - A);
			// Round some math, these values are derived from the ones above:
			const F = Math.round(C + (C - A) / 3);
			const G = Math.round(C + D / 2);
			const H = Math.round(C / 2 + A);

			const values = [
				B,
				B + Math.round(E / 2),
				-E * 3 - A,
				0,
				B + Math.round(E / 2) - A,
				D,
				0,
				E,
				F,
				G,
				H,
				C,
				C
			];
			return values.map((delta) => {
				return (h + delta + 360) % 360;
			});
		};

		const saturationSwatches = saturationValues();
		const lightnessSwatches = lightnessValues();
		const hueSwatches = hueValues();

		/**
		 * An array of colors (defined by their hex string)
		 * @type string[]
		 */
		const hslSwatches = [];
		for (let i = 0; i < saturationSwatches.length; ++i) {
			hslSwatches[i] = HSLToHex({
				h: hueSwatches[i],
				s: saturationSwatches[i],
				l: lightnessSwatches[i]
			});
		}

		return hslSwatches;
	}

	////////// SVELTE CODE ///////////////
	export let centerColor = '#69b9d9';
	export let selected = 6;

	$: colors = swatches(centerColor, selected);

	const dispatch = createEventDispatcher();
	/**
	 * This function emits the `colorChange` event.
	 * It is intended to be called directly at the event handler, it returns
	 * the event emiter function for the arguments passed as argument.
	 *
	 * @param {string} selectedColor - The color hex string for the event detail
	 * @param {number} index - The swatch index for the event detail
	 * @returns {() => void} The event emiter function intended to be used at
	 * the Svelte on:event attribute.
	 */
	function dispatchColorChange(selectedColor: string, index: number) {
		return () => dispatch('colorChange', { color: selectedColor, index });
	}
</script>

<ol style:transform={`rotate(45deg)`}>
	{#each colors as c, i}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<li
			style={`grid-area: area${i};`}
			style:--color={c}
			style:--width="64px"
			style:--height="64px"
			on:click={dispatchColorChange(c, i)}
		>
			<ColorButton selected={selected === i} />
		</li>
	{/each}
</ol>

<style>
	ol {
		list-style-type: none;
		margin: 0;
		width: calc(64px * 5);
		height: calc(64px * 5);

		display: grid;
		grid-template-columns: 64px;
		grid-template-rows: 64px;
		grid-template-areas:
			'.      .      area0   .       .'
			'.      area1  area2   area3   .'
			'area4  area5  area6   area7   area8'
			'.      area9  area10  area11  .'
			'.      .      area12  .       .';
	}
	li {
		margin: 0;
		padding: 0;
	}
</style>
