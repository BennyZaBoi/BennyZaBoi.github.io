(function () {
    const canvas = document.getElementById('pixel-overlay');
    const ctx = canvas.getContext('2d');
    const pixelSize = 40;
    const colors = ['#2d5a27', '#121412', '#1a1c1a'];

    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const cols = Math.ceil(width / pixelSize);
    const rows = Math.ceil(height / pixelSize);

    const pixels = [];
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            pixels.push({
                x: i * pixelSize,
                y: j * pixelSize,
                color: colors[Math.floor(Math.random() * colors.length)],
                active: true,
                delay: 100 + Math.random() * 400
            });
        }
    }

    pixels.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, pixelSize, pixelSize);
    });

    let startTime = null;

    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;

        ctx.clearRect(0, 0, width, height);
        let allDone = true;

        pixels.forEach(p => {
            if (elapsed > p.delay) {
                if (elapsed > p.delay + 200) {
                    p.active = false;
                } else {
                    allDone = false;
                }
            } else {
                allDone = false;
            }

            if (p.active) {
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x, p.y, pixelSize, pixelSize);
            }
        });

        if (!allDone) {
            requestAnimationFrame(animate);
        } else {
            canvas.style.display = 'none';
        }
    }

    requestAnimationFrame(animate);
})();

(function () {

    const style = document.createElement('style');
    style.textContent = `
        #contact-modal {
            position: fixed;
            inset: 0;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            background: rgba(13,15,13,0.85);
            backdrop-filter: blur(4px);
        }
        #contact-modal-box {
            width: 100%;
            max-width: 520px;
            background: #0d0f0d;
            border-top: 2px solid #a1d494;
            border-left: 2px solid #a1d494;
            border-bottom: 2px solid #9dd090;
            border-right: 2px solid #9dd090;
            box-shadow: 8px 8px 0px 0px #2d5a27;
            transition: transform 0.2s ease, opacity 0.2s ease;
        }
        #contact-modal-titlebar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #1e201e;
            padding: 8px 16px;
            border-bottom: 2px solid #42493e;
        }
        #contact-modal-dots { display: flex; gap: 6px; align-items: center; }
        #contact-modal-dots span {
            width: 12px; height: 12px; display: inline-block;
        }
        #contact-modal-title {
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            letter-spacing: 0.08em;
            color: #c2c9bb;
            text-transform: uppercase;
            margin-left: 12px;
            flex: 1;
        }
        #contact-modal-close {
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            color: #c2c9bb;
            background: none;
            border: none;
            cursor: pointer;
            padding: 0 4px;
            transition: color 0.1s;
        }
        #contact-modal-close:hover { color: #ffb4ab; }
        #contact-modal-terminal {
            padding: 24px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 14px;
            line-height: 1.5;
            min-height: 300px;
            position: relative;
            overflow: hidden;
        }
        #contact-modal-terminal::before {
            content: " ";
            display: block;
            position: absolute;
            inset: 0;
            background: linear-gradient(rgba(18,20,18,0) 50%, rgba(0,0,0,0.08) 50%);
            background-size: 100% 4px;
            pointer-events: none;
            z-index: 1;
        }
        .modal-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            position: relative;
            z-index: 2;
            min-height: 28px;
        }
        .modal-row p { flex: 1; margin: 0; }
        .modal-action-btn {
            flex-shrink: 0;
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            letter-spacing: 0.1em;
            color: #c2c9bb;
            background: none;
            border: 1px solid #42493e;
            padding: 2px 8px;
            cursor: pointer;
            transition: border-color 0.15s, color 0.15s;
            text-transform: uppercase;
        }
        .modal-action-btn:hover { border-color: #a1d494; color: #a1d494; }
        .modal-action-btn.copied { color: #a1d494; border-color: #a1d494; }
        .modal-blink::after {
            content: "█";
            animation: modal-blink 1s step-start infinite;
            color: #a1d494;
            margin-left: 4px;
        }
        @keyframes modal-blink { 50% { opacity: 0; } }
    `;
    document.head.appendChild(style);

    const modal = document.createElement('div');
    modal.id = 'contact-modal';
    modal.style.display = 'none';
    modal.innerHTML = `
        <div id="contact-modal-box" style="transform:scale(0.92);opacity:0;">
            <div id="contact-modal-titlebar">
                <div id="contact-modal-dots">
                    <span style="background:#93000a;border:1px solid rgba(255,180,171,0.2);"></span>
                    <span style="background:#624c2c;border:1px solid rgba(225,194,153,0.2);"></span>
                    <span style="background:#31512c;border:1px solid rgba(172,209,161,0.2);"></span>
                </div>
                <span id="contact-modal-title">contact_terminal.exe</span>
                <button id="contact-modal-close">[X]</button>
            </div>
            <div id="contact-modal-terminal"></div>
        </div>
    `;
    document.body.appendChild(modal);

    const LINES = [
        { text: '$ connect --host minh-ben-pham --secure', color: '#acd1a1' },
        { text: 'Establishing encrypted link...', color: '#c2c9bb', delay: 380 },
        { text: '✓ Connection established.', color: '#a1d494', delay: 700 },
        { text: '', delay: 880 },
        { text: '&gt; CONTACT_DIRECTORY:', color: '#e1c299', delay: 1050 },
        { text: '', delay: 1150 },
        {
            text: 'EMAIL&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#e2e3df">minh4business@gmail.com</span>',
            color: '#c2c9bb', delay: 1300,
            action: { label: 'COPY', value: 'minh4business@gmail.com' }
        },
        {
            text: 'GITHUB&nbsp;&nbsp;&nbsp;<span style="color:#e2e3df">github.com/BennyZaBoi</span>',
            color: '#c2c9bb', delay: 1550,
            action: { label: 'OPEN', href: 'https://github.com/BennyZaBoi' }
        },
        {
            text: 'LINKEDIN&nbsp;<span style="color:#e2e3df">linkedin.com/in/minh-ben-pham</span>',
            color: '#c2c9bb', delay: 1800,
            action: { label: 'OPEN', href: 'https://www.linkedin.com/in/minh-ben-pham/' }
        },
        { text: '', delay: 2000 },
        { text: '&gt; STATUS: ONLINE — response &lt; 24h', color: '#a1d494', delay: 2100 },
        { text: '', delay: 2250 },
        { text: '$ awaiting_input', color: '#acd1a1', delay: 2400, blink: true },
    ];

    let animated = false;

    function runTerminal() {
        const term = document.getElementById('contact-modal-terminal');
        if (animated) return;
        animated = true;
        term.innerHTML = '';

        LINES.forEach((line, i) => {
            const delay = line.delay ?? i * 130;
            setTimeout(() => {
                const row = document.createElement('div');
                row.className = 'modal-row';

                const p = document.createElement('p');
                p.style.color = line.color || '#c2c9bb';
                if (line.blink) {
                    p.innerHTML = line.text;
                    p.classList.add('modal-blink');
                } else {
                    p.innerHTML = line.text;
                }
                row.appendChild(p);

                if (line.action) {
                    const btn = document.createElement('button');
                    btn.className = 'modal-action-btn';
                    btn.textContent = line.action.label;

                    if (line.action.value) {
                        btn.addEventListener('click', () => {
                            navigator.clipboard.writeText(line.action.value).then(() => {
                                btn.textContent = 'COPIED!';
                                btn.classList.add('copied');
                                setTimeout(() => {
                                    btn.textContent = 'COPY';
                                    btn.classList.remove('copied');
                                }, 2000);
                            });
                        });
                    } else if (line.action.href) {
                        btn.addEventListener('click', () => window.open(line.action.href, '_blank'));
                    }
                    row.appendChild(btn);
                }

                term.appendChild(row);
                term.scrollTop = term.scrollHeight;
            }, delay);
        });
    }

    function openContactModal() {
        const box = document.getElementById('contact-modal-box');
        modal.style.display = 'flex';
        requestAnimationFrame(() => requestAnimationFrame(() => {
            box.style.transform = 'scale(1)';
            box.style.opacity   = '1';
        }));
        runTerminal();
    }

    function closeContactModal() {
        const box = document.getElementById('contact-modal-box');
        box.style.transform = 'scale(0.92)';
        box.style.opacity   = '0';
        setTimeout(() => { modal.style.display = 'none'; }, 200);
    }

    modal.addEventListener('click', e => { if (e.target === modal) closeContactModal(); });

    document.getElementById('contact-modal-close').addEventListener('click', closeContactModal);

    window.openContactModal  = openContactModal;
    window.closeContactModal = closeContactModal;

})();