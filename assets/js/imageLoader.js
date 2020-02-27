// const path = require('path');

export default function (filepath) {
	return new Promise((resolve) => {
		const img = new Image();
		img.src = filepath;
		img.addEventListener('load', () => resolve(img));
	});
}
