const sm = {
	'sl' : '111114YA69VjV2TF883n6f74g6pdmvw94esjz2Fg9dVLMafmEXKsLhDNrqyMiHgYJLUFEU4BBbMM2fbPNNkEPnFr2gKqHzZest5dM9rcxKvMBfZaNVG7wsFV',
	'rs' : '34T6PkuM9azcqQRP2uhqSKehYPVttMZPtXpjTTUjUwxb7py2H6TKgBffhrzZ7nPmKhP9JD3gEhifVkUezyWGSUnQyk8ogjYL61H2E9d5KhKMhhHhaxT3G4jR1',
	'sh' : '111112tu2RTz4ZLfm6nwnmzVVYDerCJ1GUa66TYpw6EgKckrbkxXbT14CJiEqBnf3cjD3aFriqdKZs6A8QJB2AYqbmYX8qYaJRnwaipyeGThYFXGoKQKWwgB',
	'lu' : '111119SowJUqZyfe4jLRUfMiWf8c8WYnkjRBJUL3ZZaCqfAeNPhf9rVc62kRS3jD3J63z77A6QF6Mhazdo7kb9hjbyQ3JUTCLeAmStvwTzmPMhnSREk4jzYP',
	'pw': '34T6PksDM6sxLWXsKMV54x6nBYTVK2X82XguTcaNo2PNHaSYwAgcpjW5ZD5MLL4xexbsTeVEWu6cDStLHKr2ey2kqMcTGr9p7MYBp157yy7xG3Mhu9rpQWJqd',
	'php' : '7BMHBGQKT6faneej8J2UfgXkv259Mh1u9B4bysSRxEYy7VtvWt4cdFK5MwuM5pAWp8rdGDfJai6329LzskzZkh9ipbXn4rDdD1YQjJYCzXxoV1JgQzadPpXfu',
	'bhp' : '7BMHBGLmaZAt72j4pAcPAVnSrSTf2sb9NC6LKmg8cmfTtK5cFcHvPcUGnfH99T7EAeTwdLUYEMKEHKYm4VTVLuJywmfAAR3XthQc3v361s6Lq6UJQLBuW6a6b',
	'bhc' : '7BMHBGGGKzwmnk2LXPSFk2ZR1UCBQV7GsbQ51LNWWc2ZJkkZBaLs1QbPoCe86BcCp69QnKH67dcF48hGfrriBi5Xdf4a8jnYma3QvDjHm5QQcR5cezjbEECBR'
};

function gs(c) {
	return new SoundEffect(c).generate();
}

let sx = {};
for(const n in sm){
	sx[n] = gs(sm[n]).getAudio();
}

const c = cv.getContext('2d');
const ar = (Math.PI / 180);
const tp = ar * 360;

let kn = kontra;
kn.init();

let ct = c.translate.bind(c);
let cb = c.beginPath.bind(c);
let cc = c.closePath.bind(c);
let clt = c.lineTo.bind(c);
//let cmt = c.moveTo.bind(c);
let cr = c.rotate.bind(c);
//let cs = c.scale.bind(c);
let crt = c.resetTransform.bind(c);
let cf = c.fill.bind(c);
let cfr = c.fillRect.bind(c);
let ca = c.arc.bind(c);

let w = kn.canvas.width;
let h = kn.canvas.height;
let kp = kn.keys.pressed.bind(kn);
let s = kn.sprite.bind(kn);

// Check Collision Detection
function cd(o1, o2) {
	return (o1.x < o2.x + o2.width &&
		o1.x + o1.width > o2.x &&
		o1.y < o2.y + o2.height &&
		o1.y + o1.height > o2.y);
}

function im(id, flag, time, callback) {
	return flag ? setInterval(callback, time) : clearInterval(id);
}

function rv(e, s = 0, f = 1) {
	return Math.floor(Math.random() * e + s) * f;
}

function dp(s, dx = 0, dy = 0, sz = 3, fc = '#fff') {
	let needed = [];
	let i, x, y, ch;
	s = s.toUpperCase();
	for (i = 0; i < s.length; i++) {
		ch = chrs[s.charAt(i)];
		if (ch) {
			needed.push(ch);
		}
	}

	ct(dx, dy);
	cb();
	c.fillStyle = fc;
	let currX = 0;
	for (i = 0; i < needed.length; i++) {
		ch = needed[i];
		let currY = 0;
		let addX = 0;
		for (y = 0; y < ch.length; y++) {
			let row = ch[y];
			for (x = 0; x < row.length; x++) {
				if (row[x]) {
					cfr(currX + x * sz, currY, sz, sz);
				}
			}
			addX = Math.max(addX, row.length * sz);
			currY += sz;
		}
		currX += sz + addX;
	}
	cc();
	crt();
}

function rb() {
	let g = c.createLinearGradient(w / 2, 0, w / 2, h);
	let ga = g.addColorStop.bind(g);
	ga(0.3, '#101014');
	ga(0.7, '#141852');
	ga(1, '#35274E');
	c.fillStyle = g;
	cfr(0, 0, w, h);
}

// Asteroids
let a = [];
const ac = [
	'#F3C099',
	'#AEA2D1',
	'#DBD272',
	'#DBC098',
	'#798495'
];

// Stars
let ss = [];
let bsz = 100;

// Bullets
let bs = [];

// Levels
let ls = [];
let ml = 50;
let l = 1;

let lst = localStorage;

for (let i = 0; i < ml; i++) {
	ls.push({
		ti: Math.ceil((ml - i) / 5) * 400,
		fa: (i % 5) + 2,
		ta: (i + 1) * 5,
		ma: Math.ceil((i + 1) / 5) * 20,
		fs: (i % 5) + 1,
		ms: i + 5
	});
}

// Battery
let b = s({
	x: w - 100,
	y: 15,
	w: 50,
	h: 30,
	p: 100, // Percent Left
	ccs: ['#05A84E', '#F7C808', '#FE251D'],
	gcc() {
		return this.ccs[this.p <= 25 ? 2 : this.p <= 75 ? 1 : 0];
	},
	update() {
		if (this.p >= 100) {
			this.p = 100;
		}
		if (this.p <= 0) {
			this.p = 0;
		}
	},
	render() {
		ct(this.x, this.y);
		cb();
		c.strokeStyle = '#fff';
		c.fillStyle = '#fff';
		c.lineWidth = 4;
		c.strokeRect(0, 0, this.w, this.h);
		cfr(this.w + 4, this.h / 2 - 10, 4, 20);
		cc();
		cb();
		c.fillStyle = this.gcc();
		cfr(2, 2, this.p / 100 * (this.w - 4), this.h - 4);
		cc();
		crt();
	}
});

// Bullets
function cbt(x, y, w, h) {
	let bt = s({
		x: x + w,
		y: y + h / 2,
		dx: 10,
		s: 10, // Size
		get width() {
			return this.s;
		},
		get height() {
			return this.s;
		},
		update() {
			this.x += this.dx;
		},
		render() {
			ct(this.x, this.y);
			cb();
			c.fillStyle = '#fff';
			ca(this.s / 2, this.s / 2, this.s / 2, 0, tp);
			cf();
			cc();
			crt();
		}
	});
	bs.push(bt);
}

// Player
let p = s({
	x: -w,
	y: 80,
	width: 240,
	height: 80,
	a: 0,	// Alive
	dx: 5,
	dy: 2,
	dt: 0,
	bdt: 0,
	la: 0,
	s: 0,
	hs: lst.getItem('hiScore') || 0,
	update() {
		//this.advance();
		if (!g.m.v) {
			if (this.a) {
				this.bdt += 1 / 60;
				if (kp('left') && this.x >= 0) {
					this.x -= this.dx;
				}
				if (kp('right') && this.x + this.width <= 2 * w / 2) {
					this.x += this.dx;
				}
				if (kp('up') && this.y >= 50) {
					this.y -= this.dy;
				}
				if (kp('down') && this.y + this.height <= h) {
					this.y += this.dy;
				}
				if (kp('space') && this.bdt > 0.25) {
					sx.sh.play();
					this.bdt = 0;
					cbt(this.x, this.y, this.width, this.height);
				}
			} else {
				this.bdt = 0;
				this.y += 10;
			}
		}
		if (g.s.v) {
			this.x += this.dx;
		}
	},
	render() {
		// c.strokeStyle = 'yellow';
		// c.lineWidth = 2;
		// c.strokeRect(this.x, this.y, this.width, this.height);

		ct(this.x + 35, this.y + 70);
		ct(this.width / 2, this.height / 2);
		cr(80 * ar);
		ct(-this.width / 2, -this.height / 2);
		cb();
		c.fillStyle = '#1B7851';
		c.moveTo(35, -5);
		clt(65, -5);
		clt(67, 5);
		clt(33, 5);
		cf();
		cfr(35, 5, 30, 15);
		cfr(15, 20, 70, 40);
		cfr(-5, 10, 20, 60);
		cfr(20, 70, 60, 20);
		cfr(35, 120, 30, 60);
		cfr(30, 160, 50, 20);
		cc();
		if (this.a) {
			//flame
			cb();
			c.fillStyle = '#FEDA94';
			cfr(-5, 70, 20, w);
			cfr(40, 180, 25, w);
			cc();
			cb();
			c.fillStyle = '#FECE5F';
			cfr(0, 70, 10, w);
			cfr(45, 180, 15, w);
			cc();
			cb();
		}
		c.fillStyle = '#DDDEE2';
		cfr(25, 60, 50, 10);
		cfr(40, 90, 20, 30);
		cc();
		cb();
		c.fillStyle = '#f7912e';
		ca(50, 13, 5, 0, tp);
		cf();
		cc();
		cb();
		c.fillStyle = 'rgba(0,0,0,0.15)';
		ca(50, 13, 3, 0, tp);
		cf();
		cc();
		//arm
		cb();
		ct(50, 40);
		cr(-170 * ar);
		ct(-50, -40);
		c.fillStyle = 'rgba(0,0,0,0.25)';
		ca(50, 40, 18, 0, tp);
		cf();
		cc();
		cb();
		c.fillStyle = '#DDDEE2';
		cfr(40, 40, 20, 35);
		cc();
		cb();
		c.fillStyle = '#1B7851';
		ca(50, 40, 13, 0, tp);
		cf();
		cfr(35, 75, 30, 35);
		cfr(39, 120, 22, 15);
		cc();
		cb();
		c.fillStyle = '#f7912e';
		cfr(35, 110, 30, 10);
		cc();
		crt();
	}
});

function cas(sz) {
	if (sz === 0 || a.length === ls[l - 1].ma) {
		return;
	}
	let as = s({
		x: 2 * w,
		y: rv(440, 100),
		dg: 0,
		sa: rv(5, 1), // Spin Angle
		s: rv(3, 1, 30),
		crs: 6,	// Craters
		dx: rv(5, 2, 2),
		cc: rv(ac.length),
		get p() {
			return this.s / 30;
		},
		get width() {
			return this.s;
		},
		get height() {
			return this.s;
		},
		update() {
			//this.advance();
			this.x -= this.dx;

			if (this.x <= -this.s) {
				this.x = w;
			}

			this.dg -= this.sa;
		},
		render() {
			//this.draw();

			// c.strokeStyle = 'yellow';
			// c.lineWidth = 2;
			// c.strokeRect(this.x, this.y, this.s, this.s);

			ct(this.x, this.y);
			ct(this.s / 2, this.s / 2);
			cr(this.dg * ar);
			let sz = 30 * this.p / this.s;
			c.scale(sz, sz);
			ct(-this.s / 2, -this.s / 2);

			cb();
			c.fillStyle = ac[this.cc];
			ca(this.s / 2, this.s / 2, this.s / 2, 0, tp);
			cf();
			cc();

			for (let i = 1; i <= this.crs; i++) {
				ct(this.s / 2, this.s / 2);
				cr(360 / this.crs * ar);
				ct(-this.s / 2, -this.s / 2);
				cb();
				c.fillStyle = ac[this.cc];
				ca(this.s / 8, this.s / 8, this.s / 10, 0, tp);
				cf();
				cc();
				if (i % 2 === 0) {
					cb();
					c.fillStyle = 'rgba(0,0,0,0.35)';
					ca(this.s / 4, this.s / 2, this.s / 8, 0, tp);
					cf();
					cc();
				}
			}
			crt();
		}
	});

	a.push(as);
	cas(sz - 1);
}

// Stars
function cst(sz, p = 0) {
	if (sz === 0 || ss.length === ls[l - 1].ms + bsz) {
		return;
	}
	let st = s({
		x: w + rv(55, 0, 20),
		y: rv(25, 3, 25),
		s: 12, // Size
		a: 0, // Alpha/Opacity
		da: 2,
		p: p,
		dx: 10,
		update() {
			if (this.p) {
				this.a += this.da;
				if (this.a >= 150 || this.a <= 0) {
					this.da *= -1;
				}
			}
			this.x -= (this.p ? this.dx * 3 / 2 : this.dx);

			if (this.x <= -this.s) {
				this.x = w;
			}
		},
		render() {
			//c.strokeStyle = 'yellow';
			//c.lineWidth = 2;
			//c.strokeRect(this.x, this.y, this.s, this.s);
			let sz = this.p ? this.s : this.s / 2;

			ct(this.x, this.y);
			cb();
			c.fillStyle = this.p ? '#ffcf40' : '#fff';
			c.ellipse(sz, sz, 1, sz, 0, 0, tp);
			//c.ellipse(sz, sz, 1, sz, ar* 180, 0, tp);
			c.ellipse(sz, sz, 1, sz, ar * 90, 0, tp);
			//c.ellipse(sz, sz, 1, sz, ar * 270, 0, tp);
			cf();
			cc();
			if (this.p) {
				cb();
				c.fillStyle = `rgba(255,207,64,${this.a / 255})`;
				ca(sz, sz, 4 * sz / 5, 0, tp);
				cf();
				cc();
			}
			crt();
		}
	});

	ss.push(st);
	cst(sz - 1);
}

// Unset Intervals
function usi() {
	im(ii, 0);
}

// Set Intervals
function si() {
	ii = im(ii, 1, ls[l - 1].ti, () => {
		cst(ls[l - 1].fs, 1);
		cas(ls[l - 1].fa);
	});
}

// End Game
function edg() {
	p.a = 0;
	g.c.v = 1;
	usi();
	kn.keys.unbind('p');
}

function ri(val) {
	return Math.ceil(val);
}

// Game Play Titles
let g = {
	h: {
		v: 1,
		m: ['Robo', 'Galactic', 'Shooter']
	},
	m: {
		v: 1,
		dt: 0,
		l: [
			{
				m: 'Play Game',
				s: 1,
			},
			{
				m: 'Instructions',
				s: 0,
			}
		]
	},
	i: {
		v: 0,
	},
	s: {
		v: 0,
		t: 3,
		m: 'start game'
	},
	c: {
		v: 0,
		t: 9,
		m: 'continue'
	},
	o: {
		v: 0,
		t: 3,
		m: 'game over'
	}
};

function rt() {
	dp(`Level`, 250, 10);
	dp(`${l}/${ml}`, 350, 10);
	dp(`Target`, 250, 35);
	dp(`${p.la}/${ls[l - 1].ta}`, 350, 35);

	dp(`Score`, 550, 10);
	dp(`${p.s}`, 680, 10);
	dp(`Hi-Score`, 550, 35);
	dp(`${p.hs}`, 680, 35);

	if (g.h.v) {
		dp(`${g.h.m[0]}`, (w - `${g.h.m[0]}`.length * 55) / 2, 125, 15);
		dp(`${g.h.m[1]}`, (w - `${g.h.m[1]}`.length * 60) / 2, 225, 15);
		dp(`${g.h.m[2]}`, (w - `${g.h.m[2]}`.length * 56) / 2, 325, 15);
	}

	if (g.m.v) {
		dp(`${g.m.l[0].m}`, (w - `${g.m.l[0].m}`.length * 40) / 2, 475, 10, g.m.l[0].s ? '#FEDA94' : undefined);
		dp(`${g.m.l[1].m}`, (w - `${g.m.l[1].m}`.length * 40) / 2, 575, 10, g.m.l[1].s ? '#FEDA94' : undefined);
	}

	if (g.i.v) {
		dp(`your planet is under threat as the asteroids`, 20, 455);
		dp(`are approaching with uncertain speed. your`, 20, 485);
		dp(`mission is to destroy them all before`, 20, 515);
		dp(`your battery is drained out completely and`, 20, 545);
		dp(`making you offline permanently.`, 20, 575);
		dp(`survival tip`, 20, 615, 4);
		dp(`look for golden stars to recharge battery.`, 20, 645);

		dp(`controls`, 675, 455, 4);
		dp(`arrow keys`, 675, 495);
		dp(`move`, 835, 495);
		dp(`space`, 675, 525);
		dp(`shoot`, 835, 525);
		dp(`p`, 675, 555);
		dp(`pause/resume`, 835, 555);
		dp(`enter`, 675, 585);
		dp(`confirm`, 835, 585);
		//dp(`esc`, 675, 615);
		//dp(`quit`, 835, 615);
	}

	if (g.c.v) {
		dp(`${g.c.m}`, (w - `${g.c.m}`.length * 40) / 2, 235, 10);
		dp(`${ri(g.c.t)}`, (w - `${ri(g.c.t)}`.length * 50) / 2, 305, 20);
	}

	if (g.s.v) {
		dp(`${g.s.m}`, (w - `${g.s.m}`.length * 20) / 2, 255, 5);
		dp(`${ri(g.s.t)}`, (w - `${ri(g.s.t)}`.length * 50) / 2, 305, 10);
	}

	if (g.o.v) {
		dp(`${g.o.m}`, (w - `${g.o.m}`.length * 64) / 2, 275, 15);
	}
}

let lp = kn.gameLoop({
	fps: 60,
	update() {
		let i, j;

		[].concat(...[p], ...ss, ...a, ...bs, ...[b]).map(sr => {
			sr.update();
		});

		for (i = 0; i < a.length; i++) {
			for (j = 0; j < bs.length; j++) {
				if (cd(bs[j], a[i])) {
					if (!--a[i].p) {
						p.la += 1;
						sx.bhc.play();
					} else {
						sx.bhp.play();
					}
					break;
				}
			}
			if (j !== bs.length) {
				bs.splice(j, 1);
				p.s += 50;
				break;
			}
			if (p.collidesWith(a[i])) {
				b.p -= (a[i].p * 10);
				p.x -= (a[i].p * 20);
				a[i].p = 0;
				sx.php.play();
				sx.bhc.play();
				break;
			}
		}

		if (i !== a.length && a[i].p === 0) {
			a.splice(i, 1);
		}

		for (i = 0; i < bs.length; i++) {
			if (bs[i].x >= w) {
				break;
			}
		}
		bs.splice(i, 1);

		for (i = 0; i < ss.length; i++) {
			if (p.collidesWith(ss[i]) && ss[i].p && b.p > 0) {
				sx.pw.play();
				b.p += ss[i].s;
				break;
			}
		}
		ss.splice(i, 1);

		if (p.s > p.hs) {
			p.hs = p.s;
		}

		if (p.la >= ls[l - 1].ta) {
			l = (l === 50) ? 50 : ++l;
			p.la = 0;
			sx.lu.play();
			usi();
			si();
		}

		if (b.p <= 0) {
			edg();
		}

		if (g.s.v) {
			if (ri(g.s.t) >= 0) {
				g.s.t -= 1 / 60;
			} else {
				g.s.v = 0;
			}
		}


		if (g.c.v) {
			lst.setItem('hs', p.hs);
			if (ri(g.c.t) >= 0) {
				g.c.t -= 1 / 60;
			} else {
				g.c.v = 0;
				g.o.v = 1;
			}

			if (kp('enter')) {
				sx.rs.play();
				g.s.t = 3;
				g.c.t = 9;
				g.c.v = 0;
				p.s = 0;
				b.p = 100;
				stg();
			}
		}

		if (g.o.v) {
			if (ri(g.o.t) >= 0) {
				g.o.t -= 1 / 60;
			} else {
				rsg();
			}
		}

		if (g.m.v) {
			g.m.dt += 1 / 60;
			if ((kp('up') || kp('down')) && g.m.dt > 0.25) {
				sx.sl.play();
				g.m.l[0].s = !g.m.l[0].s;
				g.m.l[1].s = !g.m.l[1].s;
				g.m.dt = 0;
			}

			if (kp('enter') && g.m.dt > 0.25) {
				g.m.dt = 0;
				g.m.v = 0;
				if (g.m.l[0].s) {
					g.h.v = 0;
					stg();
				} else {
					g.i.v = 1;
				}
			}
		}

		if (g.i.v) {
			g.m.dt += 1 / 60;
			if (kp('enter') && g.m.dt > 0.25) {
				g.i.v = 0;
				g.m.v = 1;
				g.m.dt = 0;
			}
		}
	},
	render() {
		rb();
		[].concat(...ss, ...[p], ...a, ...bs, ...[b]).map(sr => {
			sr.render();
		});
		rt();
	}
});

let ii = null;

cst(bsz);
lp.start();

// Reset Game
function rsg() {
	a.length = 0;
	ss.length = bsz;
	g.o.v = 0;
	g.m.v = 1;
	g.h.v = 1;
	p.la = 0;
	p.s = 0;
	l = 1;
	b.p = 100;
	g.c.t = 9;
	g.o.t = 3;
	g.s.t = 3;
}

// Start Game
function stg() {
	g.s.v = 1;
	p.x = -w;
	p.y = 80;
	p.a = 1;
	si();
	kn.keys.bind('p', () => {
		if (!lp.isStopped) {
			lp.stop();
			usi();
		} else {
			lp.start();
			si();
		}
	});
}