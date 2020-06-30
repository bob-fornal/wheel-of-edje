const pie = storage.getPie();
const group = storage.getGroup();

const getTotal = () => {
	return pie.reduce((a, b) => {
		if (b.enabled === false) return a;
		return a + b.data;
	}, 0);
};
let pieTotal =  getTotal();

let state = {
	spinning: false,
	intervalId: null,
	spin: -1,

	winning: -1,
	winnerOpen: false,

	intervalTime: 10,
	degreeRotation: 5,

	activeSound: 'zippo',
	soundOptions: soundOptions,

	menu: false,

	groupMode: true,
	groupMenu: false,
	activePerson: null
};

const configure = () => {
	const canvas = document.getElementsByClassName('spinner')[0];
	const ctx = canvas.getContext('2d');
	
	const narrower = ((window.innerWidth < window.innerHeight) ? window.innerWidth : window.innerHeight) - 40;
	const wider = ((window.innerWidth > window.innerHeight) ? window.innerWidth : window.innerHeight) - 40;
	const adjustDirection = (window.innerWidth > window.innerHeight) ? 'widthOffset' : 'heightOffset';
	const direction = {
		widthOffset: 20,
		heightOffset: 20
	};
	direction[adjustDirection] = ((wider - narrower) / 2) + 20;
	console.log(direction);
	
	ctx.canvas.width = narrower;
	ctx.canvas.height = narrower;
	
	const dongle = document.getElementsByClassName('dongle')[0];
	const dctx = dongle.getContext('2d');
	
	dctx.canvas.width = narrower;
	dctx.canvas.height = narrower;
	
	if (adjustDirection === 'widthOffset') {
		canvas.setAttribute('style', `left: ${direction.widthOffset}px;`);
		dongle.setAttribute('style', `left: ${direction.widthOffset}px;`);
		
		const eddie = document.getElementById('eddie');
		eddie.setAttribute('style', `left: ${direction.widthOffset + 10}px;`);
		eddie.classList.remove('hidden');
	} else {
		canvas.setAttribute('style', `top: ${direction.heightOffset}px;`);
		dongle.setAttribute('style', `top: ${direction.heightOffset}px;`);	
	}


	return { canvas, ctx, dongle, dctx, narrower };
};

const { canvas, ctx, dongle, dctx, narrower } = configure();

const fixed = {
	width: narrower / 2,
	height: narrower / 2,
	radius: narrower / 20,

	textMargin: narrower / 20,
	textOffset: Math.floor(narrower * (4 / 100)),

	PI: Math.PI,
	twoPI: Math.PI * 2,
	PI180: 180 / Math.PI,
	degreeShift: state.degreeRotation * Math.PI / 180,

	rad360: 6.28319,
	rad270: 4.71239
};

let startingRotation = 0;

const drawCenter = (start) => {
	dctx.clearRect(0, 0, dongle.width, dongle.height);

 	dctx.fillStyle = '#0f1f00';
	dctx.strokeStyle = "#00ff00";
	dctx.lineWidth = 3;

	dctx.beginPath();
	dctx.moveTo(fixed.width, fixed.height);
	dctx.arc(fixed.width, fixed.height, fixed.radius, 0, fixed.twoPI);
	dctx.stroke();	
	dctx.fill();
	dctx.closePath();

	dctx.fillStyle = '#005500';

	dctx.beginPath();
	dctx.moveTo(fixed.width, fixed.height);
	dctx.arc(fixed.width - 5, fixed.height + 5, fixed.radius - 20, 0, fixed.twoPI);
	dctx.fill();
	dctx.closePath();

	dctx.fillStyle = '#93c760';

	dctx.beginPath();
	dctx.moveTo(fixed.width, fixed.height);
	dctx.arc(fixed.width - 10, fixed.height + 10, fixed.radius - 35, 0, fixed.twoPI);
	dctx.fill();
	dctx.closePath();

	drawDongle(start)
};

const drawDongle = (start) => {
 	dctx.fillStyle = '#0f1f00';
	dctx.strokeStyle = "#00ff00";
	dctx.lineWidth = 3;
 
	dctx.translate(fixed.width, fixed.height);
	dctx.rotate( (Math.PI / 180) * (start * state.spin));  //rotate degrees.
	dctx.translate(-fixed.width, -fixed.height);

	dctx.beginPath();
	dctx.moveTo(fixed.width - 12, fixed.height - fixed.radius + 5);
	dctx.lineTo(fixed.width, fixed.height - (fixed.radius * 2));
	dctx.lineTo(fixed.width + 12, fixed.height - fixed.radius + 5);
	dctx.stroke();	
	dctx.fill();
};

const show = (start, spin, display = true) => {
	let lastend = start;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
  	for (let i = 0; i < pie.length; i++) {
		if (pie[i].enabled === false) continue;
		const fraction = pie[i].data / pieTotal;

		ctx.fillStyle = pie[i].color;
		ctx.strokeStyle = "#d2b48c";
		ctx.lineWidth = 8;
			
		ctx.beginPath();
		ctx.moveTo(fixed.width, fixed.height);
		ctx.arc(fixed.width, fixed.height, fixed.height - 5, lastend, lastend + (fixed.twoPI * fraction), false);

		let templeft = lastend % fixed.rad360;
		let tempright = (lastend + (fixed.twoPI * fraction)) % fixed.rad360;
		const left = (templeft < 0) ? fixed.rad360 + templeft: templeft;
		const right = (tempright < 0) ? fixed.rad360 + tempright: tempright;
		
		if (left < 4.71239 && right >= 4.71239) {
			state.winning = pie[i];
			if (display === false) {
				sounds[state.activeSound].play();
			}
		}

		ctx.lineTo(fixed.width, fixed.height);
		ctx.stroke();
		ctx.fill();

		var radius = fixed.height - fixed.textMargin;
		var endAngle = lastend + (fixed.PI * fraction) + (fraction / 1.6666667);
		var setX = fixed.width + Math.cos(endAngle) * radius;
		var setY = fixed.height + Math.sin(endAngle) * radius;

		ctx.fillStyle = pie[i].fcolor;
		ctx.font = fixed.textOffset + 'px Calibri';

		ctx.save();
		ctx.translate(setX, setY);
		ctx.rotate(endAngle);
		ctx.textAlign = 'right';
		ctx.fillText(pie[i].text, 0, 0);
		ctx.restore();

		lastend += fixed.twoPI * fraction;
	}
	
	start += fixed.degreeShift * spin;
	return start;
};

const init = () => {
	console.log('initialized');
	handleGroupChange();
	
	show(startingRotation);

	drawCenter(startingRotation);
};

	const startDongleBounce = (offsetInitialTime = 0) => {
		// Quick rotate direction (counter-clockwise or clockwise)
		for (let i = 0, len = 10; i < len; i++) {
			const time = offsetInitialTime + (i * 25);
			setTimeout(drawCenter.bind(this, i), time);
		}
		// Slow rotate back
		for (let i = 0, len = 10; i < len; i++) {
			const time = offsetInitialTime + 250 + (i * 100);
			setTimeout(drawCenter.bind(this, (-1 * i)), time);
		}
		
		// Shorter Quick rotate direction (counter-clockwise or clockwise)
		for (let i = 0, len = 3; i < len; i++) {
			const time = offsetInitialTime + 1250 + (i * 25);
			setTimeout(drawCenter.bind(this, i), time);
		}
		// Slow rotate back
		for (let i = 0, len = 3; i < len; i++) {
			const time = offsetInitialTime + 1325 + (i * 100);
			setTimeout(drawCenter.bind(this, (-1 * i)), time);
		}

	};

	function getRandomArbitrary(min, max) {
		return Math.random() * (max - min) + min;
	}

	const startRandomSpin = () => {
		const times = [
			{ min: 3000, max: 4000, stepMS: 10, calculatedTime: 0, start: 500 },
			{ min: 1000, max: 0, stepMS: 20, calculatedTime: 0, start: 0 },
			{ min: 750, max: 0, stepMS: 40, calculatedTime: 0, start: 0 },
			{ min: 500, max: 0, stepMS: 60, calculatedTime: 0, start: 0 },
			{ min: 250, max: 0, stepMS: 80, calculatedTime: 0, start: 0 }
		];
		for (let i = 0, len = times.length; i < len; i++) {
			let current = times[i];
			let next = null;

			current.calculatedTime = Math.floor(getRandomArbitrary(current.min, current.max) / current.stepMS) * current.stepMS;
			if (i < (len - 1)) {
				next = times[i + 1];
				next.max = next.min + current.calculatedTime * (0.5);
				next.start = current.start + current.calculatedTime;
			}
		}
		const timeBase = times.reduce((sum, current) => sum + current.calculatedTime, 0);;
		let totalTime = 3600 + timeBase;

		const initialBackstepRandom = getRandomArbitrary(1, 10);
		const doInitialBackStep = (initialBackstepRandom <= 5);
		const backstepRandom = getRandomArbitrary(1, 10);
		const doBackStep = (backstepRandom <= 3);
		console.log({ totalTime, times, doInitialBackStep, doBackStep });

		let offsetInitialTime = 0;
		// Otional Random back-step
		if (doInitialBackStep) {
			totalTime += 400;
			offsetInitialTime = 400;
			const reverse = state.spin * (-1);
			for (let i = 1, len = 5; i < len; i++) {
				const time = (i * 100);
				setTimeout(() => {
					startingRotation = show(startingRotation, reverse, false);
				}, time);
			}
		}

		// Start Dongle Bounce Here ... to give access to initial run
		startDongleBounce(offsetInitialTime);

		// Medium rotate for 500 ms
		for (let i = 0, len = 20; i < len; i++) {
			const time = offsetInitialTime + (i * 25);
			setTimeout(() => {
				startingRotation = show(startingRotation, state.spin, false);
			}, time);
		}

		for (let i = 0, i_len = times.length; i < i_len; i++) {
			const current = times[i];
			const number = (current.calculatedTime / current.stepMS) + 1;
			for (let j = 1, j_len = number; j < j_len; j++) {
				const time = current.start + (j * current.stepMS);
				setTimeout(() => {
					startingRotation = show(startingRotation, state.spin, false);
				}, time);		
			}
		}
		
		// Slow rotate for 3 seconds
		for (let i = 1, len = 30; i < len; i++) {
			const time = 500 + timeBase + (i * 100);
			setTimeout(() => {
				startingRotation = show(startingRotation, state.spin, false);
			}, time);
		}

		// Otional Random back-step
		if (doBackStep) {
			const backstepTime = totalTime;
			totalTime += 400;
			const reverse = state.spin * (-1);
			for (let i = 1, len = 5; i < len; i++) {
				const time = backstepTime + (i * 100);
				setTimeout(() => {
					startingRotation = show(startingRotation, reverse, false);
				}, time);
			}
		}

		// Turn off spin
		setTimeout(() => {
			stopSpinningCycle();
			console.log(state.winning);
			openWinner(state.winning);
		}, totalTime);
	};


const startSpinningCycle = () => {
	state.intervalTime = 10;
	state.degreeRotation = 5;

	startRandomSpin();
};

const stopSpinningCycle = () => {
	clearInterval(state.intervalId);
	state.intervalId = null;
	state.spinning = false;
};

let spinning = false;
const toggleSpin = (direction) => {
	if (state.menu === true || state.spinning === true) return;

	state.spin = (direction === 'clockwise') ? 1 : -1;
	state.spinning = true;
	startSpinningCycle();
};

document.addEventListener('keydown', event => {
	// 39 RIGHT ARROW, 82 L-BUTTON
	// 37 LEFT ARROW, 76 L-BUTTON
	switch(true) {
		case event.keyCode === 39 || event.keyCode === 82:
			toggleSpin('clockwise');
			break;
		case event.keyCode === 37 || event.keyCode === 76:
			toggleSpin('counter-clockwise');
			break;
		case event.keyCode === 13:
			if (state.winnerOpen === true) {
				closeWinner();
			}
			break;
	}
});
