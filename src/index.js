(function init() {
	const sm = {
		sl: '111114YA69VjV2TF883n6f74g6pdmvw94esjz2Fg9dVLMafmEXKsLhDNrqyMiHgYJLUFEU4BBbMM2fbPNNkEPnFr2gKqHzZest5dM9rcxKvMBfZaNVG7wsFV',
		rs: '34T6PkuM9azcqQRP2uhqSKehYPVttMZPtXpjTTUjUwxb7py2H6TKgBffhrzZ7nPmKhP9JD3gEhifVkUezyWGSUnQyk8ogjYL61H2E9d5KhKMhhHhaxT3G4jR1',
		sh: '111112tu2RTz4ZLfm6nwnmzVVYDerCJ1GUa66TYpw6EgKckrbkxXbT14CJiEqBnf3cjD3aFriqdKZs6A8QJB2AYqbmYX8qYaJRnwaipyeGThYFXGoKQKWwgB',
		lu: '111119SowJUqZyfe4jLRUfMiWf8c8WYnkjRBJUL3ZZaCqfAeNPhf9rVc62kRS3jD3J63z77A6QF6Mhazdo7kb9hjbyQ3JUTCLeAmStvwTzmPMhnSREk4jzYP',
		pw: '34T6PksDM6sxLWXsKMV54x6nBYTVK2X82XguTcaNo2PNHaSYwAgcpjW5ZD5MLL4xexbsTeVEWu6cDStLHKr2ey2kqMcTGr9p7MYBp157yy7xG3Mhu9rpQWJqd',
		php: '7BMHBGQKT6faneej8J2UfgXkv259Mh1u9B4bysSRxEYy7VtvWt4cdFK5MwuM5pAWp8rdGDfJai6329LzskzZkh9ipbXn4rDdD1YQjJYCzXxoV1JgQzadPpXfu',
		bhp: '7BMHBGLmaZAt72j4pAcPAVnSrSTf2sb9NC6LKmg8cmfTtK5cFcHvPcUGnfH99T7EAeTwdLUYEMKEHKYm4VTVLuJywmfAAR3XthQc3v361s6Lq6UJQLBuW6a6b',
		bhc: '7BMHBGGGKzwmnk2LXPSFk2ZR1UCBQV7GsbQ51LNWWc2ZJkkZBaLs1QbPoCe86BcCp69QnKH67dcF48hGfrriBi5Xdf4a8jnYma3QvDjHm5QQcR5cezjbEECBR',
	};

	function gs(c) {
		return new SoundEffect(c).generate();
	}

	let sx = {};
	for (const n in sm) {
		sx[n] = gs(sm[n]).getAudio();
	}

	const ctx = myCanvas.getContext('2d');
	const ar = Math.PI / 180;
	const tp = ar * 360;

	let kn = kontra;
	kn.init();

	let w = kn.canvas.width;
	let h = kn.canvas.height;
	let kp = kn.keys.pressed.bind(kn);
	let s = kn.sprite.bind(kn);

	// Check Collision Detection
	function cd(o1, o2) {
		return o1.x < o2.x + o2.width && o1.x + o1.width > o2.x && o1.y < o2.y + o2.height && o1.y + o1.height > o2.y;
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

		ctx.translate(dx, dy);
		ctx.beginPath();
		ctx.fillStyle = fc;
		let currX = 0;
		for (i = 0; i < needed.length; i++) {
			ch = needed[i];
			let currY = 0;
			let addX = 0;
			for (y = 0; y < ch.length; y++) {
				let row = ch[y];
				for (x = 0; x < row.length; x++) {
					if (row[x]) {
						ctx.fillRect(currX + x * sz, currY, sz, sz);
					}
				}
				addX = Math.max(addX, row.length * sz);
				currY += sz;
			}
			currX += sz + addX;
		}
		ctx.closePath();
		ctx.resetTransform();
	}

	function rb() {
		let g = ctx.createLinearGradient(w / 2, 0, w / 2, h);
		let ga = g.addColorStop.bind(g);
		ga(0.3, '#101014');
		ga(0.7, '#141852');
		ga(1, '#35274E');
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, w, h);
	}

	// Asteroids
	let a = [];

	// Stars
	let ss = [];
	let bsz = 100;

	// Bullets
	let bs = [];

	// Levels
	let ls = [];
	let ml = 50;
	let l = 1;

	// Flipping Scores
	let fla = 99999;
	let fls = 9999999999;

	let lst = localStorage;

	for (let i = 0; i < ml; i++) {
		ls.push({
			ti: Math.ceil((ml - i) / 5) * 250,
			fa: (i % 5) + 2,
			ta: (i + 1) * 5,
			ma: Math.ceil((i + 1) / 5) * 20,
			fs: (i % 5) + 1,
			ms: i + 5,
		});
	}

	// Battery
	let b = s({
		x: w - 100,
		y: 15,
		w: 50,
		h: 30,
		p: 100, // Percent Left
		ccs: ['#05A84E', '#FE251D', '#F7C808'],
		t: 1,
		gcl() {
			// Battery Level that will determine its color and blinking
			return this.p <= 20 ? 1 : this.p <= 60 ? 2 : 0;
		},
		gcc() {
			return this.ccs[this.gcl()];
		},
		update() {
			if (this.p >= 100) {
				this.p = 100;
			}
			if (this.p <= 0) {
				this.p = 0;
			}

			if (this.gcl()) {
				this.t -= 1 / (10 * this.gcl());
				if (ri(this.t) < -1) {
					this.t = 1;
				}
			}
		},
		render() {
			if (ri(this.t) >= 0) {
				ctx.translate(this.x, this.y);
				ctx.beginPath();
				ctx.strokeStyle = '#fff';
				ctx.fillStyle = '#fff';
				ctx.lineWidth = 4;
				ctx.strokeRect(0, 0, this.w, this.h);
				ctx.fillRect(this.w + 4, this.h / 2 - 10, 4, 20);
				ctx.closePath();
				ctx.beginPath();
				ctx.fillStyle = this.gcc();
				ctx.fillRect(2, 2, (this.p / 100) * (this.w - 4), this.h - 4);
				ctx.closePath();
				ctx.resetTransform();
			}
		},
	});

	// Bullets
	function cbt(x, y, w, h) {
		let bt;
		let bti = new Image();
		bti.src = '../assets/bullet.svg';
		bti.onload = function () {
			bt = s({
				x: x + w,
				y: y + h / 2,
				dx: 10,
				width: 120,
				height: 45,
				image: bti,
				update() {
					this.x += this.dx;
				},
			});
			bs.push(bt);
		};
	}

	// Player
	let p;
	let pi = new Image();
	pi.src = '../assets/player.svg';
	pi.onload = function () {
		p = s({
			x: -w,
			y: 80,
			width: 120,
			height: 60,
			image: pi,
			a: 0, // Alive
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
						if (kp('left') && this.x >= 0 && !g.s.v) {
							this.x -= this.dx;
						}
						if (kp('right') && this.x + this.width <= (2 * w) / 3 && !g.s.v) {
							this.x += this.dx;
						}
						if (kp('up') && this.y >= 50) {
							this.y -= this.dy;
						}
						if (kp('down') && this.y + this.height <= h) {
							this.y += this.dy;
						}
						if (kp('space') && this.bdt > 0.1) {
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
		});
	};

	// Asteroid
	function cas(sz) {
		if (sz === 0 || a.length === ls[l - 1].ma) {
			return;
		}

		let as;
		let ai = new Image();
		ai.src = '../assets/asteroid.svg';
		ai.onload = function () {
			as = s({
				x: 2 * w,
				y: rv(440, 100),
				dg: 0,
				sa: rv(5, 1), // Spin Angle
				s: rv(4, 1, 25),
				dx: rv(5, 2, 2),
				cc: rv(12, 1, 30),
				image: ai,
				get p() {
					return this.s / 25;
				},
				get width() {
					return this.s;
				},
				get height() {
					return this.s;
				},
				update() {
					this.x -= this.dx;

					if (this.x <= -this.s) {
						this.x = w;
					}

					this.dg -= this.sa;
				},
				render() {
					ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
					ctx.rotate(this.dg * ar);
					let sz = (this.p * 25) / 100;
					ctx.scale(sz, sz);
					ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
					ctx.beginPath();
					ctx.filter = `hue-rotate(${this.cc}deg)`;
					this.draw();
					ctx.filter = 'none';
					ctx.resetTransform();
				},
			});
			a.push(as);
		};

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
			s: 20, // Size
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
				this.x -= this.p ? (this.dx * 3) / 2 : this.dx;

				if (this.x <= -this.s) {
					this.x = w;
				}
			},
			render() {
				let sz = this.p ? this.s : this.s / 2;

				ctx.translate(this.x, this.y);
				ctx.beginPath();
				ctx.fillStyle = this.p ? '#ffcf40' : '#fff';
				ctx.ellipse(sz, sz, 1, sz, 0, 0, tp);
				ctx.ellipse(sz, sz, 1, sz, ar * 90, 0, tp);
				ctx.fill();
				ctx.closePath();
				if (this.p) {
					ctx.beginPath();
					ctx.fillStyle = `rgba(255,207,64,${this.a / 255})`;
					ctx.arc(sz, sz, (4 * sz) / 5, 0, tp);
					ctx.fill();
					ctx.closePath();
				}
				ctx.resetTransform();
			},
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
			// Heading
			v: 1,
			m: ['Robo', 'Galactic', 'Shooter'],
		},
		m: {
			// Menu
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
				},
			],
		},
		i: {
			// Instructions
			v: 0,
		},
		s: {
			// Game Start
			v: 0,
			t: 3,
			m: 'start game',
		},
		t: {
			v: 0,
			t: 2,
			i: 0,
			m: ['boom', 'ouch', 'level up'],
		},
		c: {
			// Continue Game
			v: 0,
			t: 9,
			m: 'continue',
		},
		o: {
			// Game Over
			v: 0,
			t: 3,
			m: 'game over',
		},
	};

	function rt() {
		dp(`Level`, 280, 10);
		dp(`${l}/${ml}`, 380, 10);
		dp(`Target`, 280, 35);
		dp(`${p.la}/${ls[l - 1].ta}`, 380, 35);

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

		if (g.t.v) {
			dp(`${g.t.m[g.t.i]}`, 130 - (`${g.t.m[g.t.i]}`.length * 20) / 2, 15, 5);
		}
	}

	let lp = kn.gameLoop({
		fps: 60,
		update() {
			let i, j;

			[].concat(...[p], ...ss, ...a, ...bs, ...[b]).map((sr) => {
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
							g.t.i = 0;
							g.t.v = 1;
							g.t.t = 2;
						}
						break;
					}
				}
				if (j !== bs.length) {
					bs.splice(j, 1);
					p.s += 50;
					break;
				}
				if (p.collidesWith(a[i]) && !g.s.v) {
					b.p -= a[i].p * 10;
					p.x -= a[i].p * 20;
					a[i].p = 0;
					sx.php.play();
					sx.bhc.play();
					g.t.i = 1;
					g.t.v = 1;
					g.t.t = 2;
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

			if (p.s >= fls) {
				p.s = 0;
				p.hs = fls;
			}

			if (p.la >= ls[l - 1].ta) {
				if (l < ml) {
					l += 1;
					p.la = 0;
					g.t.i = 2;
					g.t.v = 1;
					g.t.t = 2;
					sx.lu.play();
					usi();
					si();
				} else {
					if (p.la === fla) {
						p.la = 0;
					}
				}
			}

			if (b.p <= 0 && p.a) {
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
				lst.setItem('hiScore', p.hs);
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

			if (g.t.v) {
				g.t.t -= 1 / 60;
				if (ri(g.t.t) <= 0) {
					g.t.v = 0;
				}
			}

			if (!g.h.v && !g.m.v && !g.i.v && !g.s.v) {
				b.p -= 1 / 120;
			}
		},
		render() {
			rb();
			[].concat(...ss, ...[p], ...a, ...bs, ...[b]).map((sr) => {
				sr.render();
			});
			rt();
		},
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
})();
