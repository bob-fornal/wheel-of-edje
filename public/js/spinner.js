
const spinner = {
	pie: null,
	group: null,
	pieTotal: 0,
	
	state: {
		spinning: false,
		intervalId: null,
		spin: -1,
	
		winning: -1,
		winnerOpen: false,
	
		intervalTime: 10,
		degreeRotation: 5,
	
		activeSound: 'zippo',
		soundOptions: sound.options,
	
		menu: false,
		help: false,
	
		groupMode: true,
		groupMenu: false,
		activePerson: null,
		activePersonIndex: -1
	},

	settings: {},

	startingRotation: 0
};

spinner.configure = () => {
	const canvas = document.querySelector('.spinner');
	const ctx = canvas.getContext('2d');
	
	const narrower = ((window.innerWidth < window.innerHeight) ? window.innerWidth : window.innerHeight) - 40;
	const wider = ((window.innerWidth > window.innerHeight) ? window.innerWidth : window.innerHeight) - 40;
	const adjustDirection = (window.innerWidth > window.innerHeight) ? 'widthOffset' : 'heightOffset';
	const direction = {
		widthOffset: 20,
		heightOffset: 20
	};
	direction[adjustDirection] = ((wider - narrower) / 2) + 20;
	
	ctx.canvas.width = narrower;
	ctx.canvas.height = narrower;

	const underbody = document.querySelector('.underbody');
	const uctx = underbody.getContext('2d');

	uctx.canvas.width = narrower;
	uctx.canvas.height = narrower;
	
	const dongle = document.querySelector('.dongle');
	const dctx = dongle.getContext('2d');
	
	dctx.canvas.width = narrower;
	dctx.canvas.height = narrower;
	
	const overlaySelector = document.querySelector('.overlay');
	const octx = overlaySelector.getContext('2d');

	octx.canvas.width = narrower;
	octx.canvas.height = narrower;

	if (adjustDirection === 'widthOffset') {
		canvas.setAttribute('style', `left: ${direction.widthOffset}px;`);
		underbody.setAttribute('style', `left: ${direction.widthOffset}px;`);
		dongle.setAttribute('style', `left: ${direction.widthOffset}px;`);
		overlaySelector.setAttribute('style', `left: ${direction.widthOffset}px;`);
		
		const eddie = document.getElementById('eddie');
		eddie.setAttribute('style', `left: ${direction.widthOffset + 10}px;`);
		eddie.classList.remove('hidden');
	} else {
		canvas.setAttribute('style', `top: ${direction.heightOffset}px;`);
		underbody.setAttribute('style', `top: ${direction.heightOffset}px;`);
		dongle.setAttribute('style', `top: ${direction.heightOffset}px;`);	
		overlaySelector.setAttribute('style', `top: ${direction.heightOffset}px;`);	
	}

	return { canvas, ctx, underbody, uctx, dongle, dctx, overlaySelector, octx, narrower };
};

spinner.settings = spinner.configure();

spinner.fixed = {
	width: spinner.settings.narrower / 2,
	height: spinner.settings.narrower / 2,
	radius: spinner.settings.narrower / 20,
	radiusAdjust: 20,

	textMargin: spinner.settings.narrower / 20,
	textOffset: Math.floor(spinner.settings.narrower * (2.8 / 100)),

	PI: Math.PI,
	twoPI: Math.PI * 2,
	PI180: 180 / Math.PI,
	degreeShift: spinner.state.degreeRotation * Math.PI / 180,

	rad360: 6.28319,
	rad270: 4.71239
};

spinner.drawCenter = (start) => {
	spinner.settings.dctx.clearRect(0, 0, spinner.settings.dongle.width, spinner.settings.dongle.height);

	spinner.settings.dctx.fillStyle = '#0f1f00';
	spinner.settings.dctx.strokeStyle = "#00ff00";
	spinner.settings.dctx.lineWidth = 3;

	spinner.settings.dctx.beginPath();
	spinner.settings.dctx.moveTo(spinner.fixed.width, spinner.fixed.height);
	spinner.settings.dctx.arc(spinner.fixed.width, spinner.fixed.height, spinner.fixed.radius, 0, spinner.fixed.twoPI);
	spinner.settings.dctx.stroke();	
	spinner.settings.dctx.fill();
	spinner.settings.dctx.closePath();

	spinner.settings.dctx.fillStyle = '#005500';

	spinner.settings.dctx.beginPath();
	spinner.settings.dctx.moveTo(spinner.fixed.width, spinner.fixed.height);
	spinner.settings.dctx.arc(spinner.fixed.width - 5, spinner.fixed.height + 5, spinner.fixed.radius - 20, 0, spinner.fixed.twoPI);
	spinner.settings.dctx.fill();
	spinner.settings.dctx.closePath();

	spinner.settings.dctx.fillStyle = '#93c760';

	spinner.settings.dctx.beginPath();
	spinner.settings.dctx.moveTo(spinner.fixed.width, spinner.fixed.height);
	spinner.settings.dctx.arc(spinner.fixed.width - 10, spinner.fixed.height + 10, spinner.fixed.radius - 35, 0, spinner.fixed.twoPI);
	spinner.settings.dctx.fill();
	spinner.settings.dctx.closePath();

	spinner.drawDongle(start);
};

spinner.drawDongle = (start) => {
	spinner.settings.dctx.fillStyle = '#0f1f00';
	spinner.settings.dctx.strokeStyle = "#00ff00";
	spinner.settings.dctx.lineWidth = 3;
 
	spinner.settings.dctx.translate(spinner.fixed.width, spinner.fixed.height);
	spinner.settings.dctx.rotate( (Math.PI / 180) * (start * spinner.state.spin));  //rotate degrees.
	spinner.settings.dctx.translate(-spinner.fixed.width, -spinner.fixed.height);

	spinner.settings.dctx.beginPath();
	spinner.settings.dctx.moveTo(spinner.fixed.width - 12, spinner.fixed.height - spinner.fixed.radius + 5);
	spinner.settings.dctx.lineTo(spinner.fixed.width, spinner.fixed.height - (spinner.fixed.radius * 2));
	spinner.settings.dctx.lineTo(spinner.fixed.width + 12, spinner.fixed.height - spinner.fixed.radius + 5);
	spinner.settings.dctx.stroke();	
	spinner.settings.dctx.fill();
};

spinner.show = (start, spin, display = true) => {
	let lastend = start;
	spinner.settings.ctx.clearRect(0, 0, spinner.settings.canvas.width, spinner.settings.canvas.height);
	
  	for (let i = 0; i < spinner.pie.length; i++) {
		if (spinner.pie[i].enabled === false) continue;
		const fraction = spinner.pie[i].data / spinner.pieTotal;

		spinner.settings.ctx.fillStyle = spinner.pie[i].color;
		spinner.settings.ctx.strokeStyle = "#d2b48c";
		spinner.settings.ctx.lineWidth = 8;
			
		spinner.settings.ctx.beginPath();
		spinner.settings.ctx.moveTo(spinner.fixed.width, spinner.fixed.height);
		spinner.settings.ctx.arc(spinner.fixed.width, spinner.fixed.height, spinner.fixed.height - spinner.fixed.radiusAdjust, lastend, lastend + (spinner.fixed.twoPI * fraction), false);

		let templeft = lastend % spinner.fixed.rad360;
		let tempright = (lastend + (spinner.fixed.twoPI * fraction)) % spinner.fixed.rad360;
		const left = (templeft < 0) ? spinner.fixed.rad360 + templeft: templeft;
		const right = (tempright < 0) ? spinner.fixed.rad360 + tempright: tempright;
		
		if (left < 4.71239 && right >= 4.71239) {
			spinner.state.winning = spinner.pie[i];
			if (display === false && spinner.state.activeSound !== 'SILENT') {
				sound.sounds[spinner.state.activeSound].play();
			}
		}

		spinner.settings.ctx.lineTo(spinner.fixed.width, spinner.fixed.height);
		spinner.settings.ctx.stroke();
		spinner.settings.ctx.fill();

		var radius = spinner.fixed.height - spinner.fixed.textMargin;
		var endAngle = lastend + (spinner.fixed.PI * fraction) + (fraction / 1.6666667);
		var setX = spinner.fixed.width + Math.cos(endAngle) * radius;
		var setY = spinner.fixed.height + Math.sin(endAngle) * radius;

		spinner.settings.ctx.fillStyle = spinner.pie[i].fcolor;
		spinner.settings.ctx.font = spinner.fixed.textOffset + 'px sans-serif';

		spinner.settings.ctx.save();
		spinner.settings.ctx.translate(setX, setY);
		spinner.settings.ctx.rotate(endAngle);
		spinner.settings.ctx.textAlign = 'right';
		spinner.settings.ctx.fillText(spinner.pie[i].text, 0, 0);
		spinner.settings.ctx.restore();

		lastend += spinner.fixed.twoPI * fraction;
	}
	
	start += spinner.fixed.degreeShift * spin;
	return start;
};

spinner.fillUnderbody = () => {
	const height = spinner.settings.uctx.canvas.width;
	const width = spinner.settings.uctx.canvas.height;

	const h2 = height / 2;
	const w2 = width / 2;

    var radgrad = spinner.settings.uctx.createRadialGradient(w2, h2, 0, w2, w2, h2);
    radgrad.addColorStop(0.00, 'rgba(50, 98, 4, 1.0)');
    radgrad.addColorStop(0.85, 'rgba(109, 164, 56, 1.0)');
    radgrad.addColorStop(1.00, 'rgba(109, 164, 56, 0.0)');
  
    spinner.settings.uctx.fillStyle = radgrad;
    spinner.settings.uctx.fillRect(0, 0, height, width);
};

spinner.fillOverlay = () => {
	const cx_center = spinner.settings.octx.canvas.width / 2;
	const cy_center = spinner.settings.octx.canvas.height / 2;

	const offsetCenterX = cx_center - spinner.fixed.radius + 5;
	const offsetCenterY = cy_center - (spinner.fixed.radius / 2) + 5;

	// overlay.drawLightGlare({
	// 	ctx: spinner.settings.octx,
	// 	angle1: 310, angle2: 100, angle3: 130, angle4: 280,
	// 	cx: cx_center, cy: cy_center, radius: spinner.fixed.height - 5,
	// 	fillStyle: 'rgba(200, 200, 200, 0.10)',
	// 	strokeStyle: 'rgba(255, 255, 255, 0.15)',
	// 	lineWidth: 10
	// });

	overlay.drawStar({
		ctx: spinner.settings.octx,
		cx: offsetCenterX, cy: offsetCenterY,
		spikes: 4, outerRadius: 10, innerRadius: 3,
		strokeColor: 'rgba(0, 0, 0, 0.5)', fillColor: 'rgba(255, 255, 0, 0.7)',
		lineWidth: 3
	});
};

spinner.getTotal = () => {
	return spinner.pie.reduce((a, b) => {
		if (b.enabled === false) return a;
		return a + b.data;
	}, 0);
};

spinner.init = () => {
	spinner.fillUnderbody();

	spinner.pie = storage.getPie();
	spinner.group = storage.getGroup();
	spinner.pieTotal = spinner.getTotal();

	menu.handleGroupChange();
	sound.init();

	spinner.show(spinner.startingRotation);
	spinner.drawCenter(spinner.startingRotation);
	spinner.fillOverlay();

	document.removeEventListener('keydown', spinner.handleKeydownEvent);
	setTimeout(() => {
		document.addEventListener('keydown', spinner.handleKeydownEvent);
	});
};

spinner.startDongleBounce = (offsetInitialTime = 0) => {
	// Quick rotate direction (counter-clockwise or clockwise)
	for (let i = 0, len = 10; i < len; i++) {
		const time = offsetInitialTime + (i * 25);
		setTimeout(spinner.drawCenter.bind(this, i), time);
	}
	// Slow rotate back
	for (let i = 0, len = 10; i < len; i++) {
		const time = offsetInitialTime + 250 + (i * 100);
		setTimeout(spinner.drawCenter.bind(this, (-1 * i)), time);
	}
	
	// Shorter Quick rotate direction (counter-clockwise or clockwise)
	for (let i = 0, len = 3; i < len; i++) {
		const time = offsetInitialTime + 1250 + (i * 25);
		setTimeout(spinner.drawCenter.bind(this, i), time);
	}
	// Slow rotate back
	for (let i = 0, len = 3; i < len; i++) {
		const time = offsetInitialTime + 1325 + (i * 100);
		setTimeout(spinner.drawCenter.bind(this, (-1 * i)), time);
	}

};

spinner.getRandomArbitrary = (min, max) => {
	return Math.random() * (max - min) + min;
};

spinner.startRandomSpin = () => {
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

		current.calculatedTime = Math.floor(spinner.getRandomArbitrary(current.min, current.max) / current.stepMS) * current.stepMS;
		if (i < (len - 1)) {
			next = times[i + 1];
			next.max = next.min + current.calculatedTime * (0.5);
			next.start = current.start + current.calculatedTime;
		}
	}
	const timeBase = times.reduce((sum, current) => sum + current.calculatedTime, 0);
	let totalTime = 3600 + timeBase;

	const initialBackstepRandom = spinner.getRandomArbitrary(1, 10);
	const doInitialBackStep = (initialBackstepRandom <= 5);
	const backstepRandom = spinner.getRandomArbitrary(1, 10);
	const doBackStep = (backstepRandom <= 3);

	let offsetInitialTime = 0;
	// Otional Random back-step
	if (doInitialBackStep) {
		totalTime += 400;
		offsetInitialTime = 400;
		const reverse = spinner.state.spin * (-1);
		for (let i = 1, len = 5; i < len; i++) {
			const time = (i * 100);
			setTimeout(() => {
				spinner.startingRotation = spinner.show(spinner.startingRotation, reverse, false);
			}, time);
		}
	}

	// Start Dongle Bounce Here ... to give access to initial run
	spinner.startDongleBounce(offsetInitialTime);

	// Medium rotate for 500 ms
	for (let i = 0, len = 20; i < len; i++) {
		const time = offsetInitialTime + (i * 25);
		setTimeout(() => {
			spinner.startingRotation = spinner.show(spinner.startingRotation, spinner.state.spin, false);
		}, time);
	}

	for (let i = 0, i_len = times.length; i < i_len; i++) {
		const current = times[i];
		const number = (current.calculatedTime / current.stepMS) + 1;
		for (let j = 1, j_len = number; j < j_len; j++) {
			const time = current.start + (j * current.stepMS);
			setTimeout(() => {
				spinner.startingRotation = spinner.show(spinner.startingRotation, spinner.state.spin, false);
			}, time);		
		}
	}
	
	// Slow rotate for 3 seconds
	for (let i = 1, len = 30; i < len; i++) {
		const time = 500 + timeBase + (i * 100);
		setTimeout(() => {
			spinner.startingRotation = spinner.show(spinner.startingRotation, spinner.state.spin, false);
		}, time);
	}

	// Otional Random back-step
	if (doBackStep) {
		const backstepTime = totalTime;
		totalTime += 400;
		const reverse = spinner.state.spin * (-1);
		for (let i = 1, len = 5; i < len; i++) {
			const time = backstepTime + (i * 100);
			setTimeout(() => {
				spinner.startingRotation = spinner.show(spinner.startingRotation, reverse, false);
			}, time);
		}
	}

	// Turn off spin
	setTimeout(() => {
		spinner.stopSpinningCycle();
		winner.open(spinner.state.winning);
	}, totalTime);
};

spinner.startSpinningCycle = () => {
	spinner.state.intervalTime = 10;
	spinner.state.degreeRotation = 5;

	spinner.startRandomSpin();
};

spinner.stopSpinningCycle = () => {
	clearInterval(spinner.state.intervalId);
	spinner.state.intervalId = null;
	spinner.state.spinning = false;
};

spinner.toggleSpin = (direction) => {
	if (spinner.state.menu === true || spinner.state.spinning === true) return;

	spinner.state.spin = (direction === 'clockwise') ? 1 : -1;
	spinner.state.spinning = true;
	spinner.startSpinningCycle();
};

spinner.handleKeydownEvent = (event) => {
	// 39 RIGHT ARROW, 82 L-BUTTON
	// 37 LEFT ARROW, 76 R-BUTTON
	switch(true) {
		case event.keyCode === 39 || event.keyCode === 82:
			spinner.toggleSpin('clockwise');
			break;
		case event.keyCode === 37 || event.keyCode === 76:
			spinner.toggleSpin('counter-clockwise');
			break;
		case event.keyCode === 13:
			if (spinner.state.winnerOpen === true) {
				winner.close();
			}
			break;
	}
};
