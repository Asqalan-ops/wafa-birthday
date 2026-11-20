/* ===== CONFIG: to use your own music, drop a file in assets/audio/ and set the path, e.g. 'assets/audio/birthday.mp3'.
   Leave '' to use the built-in gentle synthesized melody (no audio file needed). ===== */
var AUDIO_SRC = '';
var START_MUSIC_ON_BEGIN = true;

(function () {
  var $ = function (id) { return document.getElementById(id); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* loader */
  addEventListener('load', function () { setTimeout(function () { $('loader').classList.add('done'); }, reduce ? 0 : 2200); });

  /* floating hearts */
  var hw = $('hearts');
  if (!reduce) for (var i = 0; i < 16; i++) {
    var h = document.createElement('span');
    h.textContent = '♥';
    h.style.left = Math.random() * 100 + '%';
    h.style.fontSize = 10 + Math.random() * 18 + 'px';
    h.style.animationDuration = 14 + Math.random() * 14 + 's';
    h.style.animationDelay = -Math.random() * 28 + 's';
    hw.appendChild(h);
  }

  /* glowing particles */
  var c = $('fx'), x = c.getContext('2d'), W, H, P = [];
  function size() { W = c.width = innerWidth; H = c.height = innerHeight; }
  size(); addEventListener('resize', size);
  if (!reduce) {
    for (var j = 0; j < 55; j++) P.push({ x: Math.random() * W, y: Math.random() * H, r: 0.8 + Math.random() * 1.8, vx: (Math.random() - .5) * .15, vy: -.05 - Math.random() * .2, p: Math.random() * 6, g: Math.random() > .5 });
    (function loop() {
      x.clearRect(0, 0, W, H);
      P.forEach(function (q) {
        q.x += q.vx; q.y += q.vy; q.p += .02;
        if (q.y < -5) { q.y = H + 5; q.x = Math.random() * W; }
        x.globalAlpha = .25 + .45 * Math.abs(Math.sin(q.p));
        x.fillStyle = q.g ? '#c9a97a' : '#e8a0b8';
        x.shadowColor = x.fillStyle; x.shadowBlur = 10;
        x.beginPath(); x.arc(q.x, q.y, q.r, 0, 6.283); x.fill();
      });
      requestAnimationFrame(loop);
    })();
  }

  /* scroll reveal */
  var rv = document.querySelectorAll('.rv');
  rv.forEach(function (e) { e.style.transitionDelay = (Array.prototype.indexOf.call(e.parentNode.children, e) % 6) * 90 + 'ms'; });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }); }, { threshold: .15 });
    rv.forEach(function (e) { io.observe(e); });
  } else rv.forEach(function (e) { e.classList.add('in'); });

  /* music: audio file if configured, otherwise a synthesized music-box melody (public-domain tune) */
  var ctx, master, audio, playing = false, timer, nextT = 0, vol = .5;
  var NOTES = [[7,.75],[7,.25],[9,1],[7,1],[12,1],[11,2],[7,.75],[7,.25],[9,1],[7,1],[14,1],[12,2],[7,.75],[7,.25],[19,1],[16,1],[12,1],[11,1],[9,1],[17,.75],[17,.25],[16,1],[12,1],[14,1],[12,2]], BEAT = .7;
  function schedule(t) {
    NOTES.forEach(function (n) {
      var d = n[1] * BEAT, o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'triangle'; o.frequency.value = 261.63 * Math.pow(2, n[0] / 12);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.3, t + .02); g.gain.exponentialRampToValueAtTime(.001, t + d + .8);
      o.connect(g); g.connect(master); o.start(t); o.stop(t + d + .85); t += d;
    });
  }
  function setPlaying(on) {
    playing = on; $('music').classList.toggle('on', on);
    $('mbtn').firstChild.textContent = on ? '❚❚' : '♪';
    $('mbtn').setAttribute('aria-label', on ? 'Pause music' : 'Play music');
  }
  function play() {
    if (AUDIO_SRC) {
      audio = audio || Object.assign(new Audio(AUDIO_SRC), { loop: true, volume: vol });
      audio.play().then(function () { setPlaying(true); }).catch(function () { setPlaying(false); });
      return;
    }
    var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    if (!ctx) {
      ctx = new AC(); master = ctx.createGain(); master.gain.value = vol * .8; master.connect(ctx.destination);
      nextT = ctx.currentTime + .1;
      timer = setInterval(function () { while (nextT < ctx.currentTime + 1.5) { schedule(nextT); nextT += 24 * BEAT + 2; } }, 300);
    }
    ctx.resume(); setPlaying(true);
  }
  function pause() { if (AUDIO_SRC) { if (audio) audio.pause(); } else if (ctx) ctx.suspend(); setPlaying(false); }
  $('mbtn').addEventListener('click', function () { playing ? pause() : play(); });
  $('vol').addEventListener('input', function (e) { vol = +e.target.value; if (audio) audio.volume = vol; if (master) master.gain.value = vol * .8; });

  /* buttons */
  $('begin').addEventListener('click', function () {
    if (START_MUSIC_ON_BEGIN && !playing) play();
    $('letter').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  });
  $('open').addEventListener('click', function () {
    var m = $('msg'), o = m.classList.toggle('open');
    this.setAttribute('aria-expanded', o);
    this.textContent = o ? '♥ close the surprise' : '🎉 open the surprise';
    if (o) setTimeout(function () { m.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 300);
  });
  $('again').addEventListener('click', function () { $('top').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); });
})();
