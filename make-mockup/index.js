import { el, mount, svg, unmount } from 'https://redom.js.org/redom.es.min.js';

(() => {
  function main() {
    const min = 100;
    const max = Math.pow(10, 4);
    let count = 300;
    let first = true;

    class Circle {
      constructor() {
        const r = (n, start = 0) => start + Math.floor(Math.random() * n);

        if (true) {
          this.el = svg('circle', {
            r: r(15, 5),
            cx: r(window.innerWidth),
            cy: r(window.innerHeight),
            // fill: `rgba(128,128,128, ${r(0.2, 0.6)})`,
            fill: `hsla(${r(360)},${r(100)}%,${r(100)}%, ${r(0.2, 0.6)})`,
          });
        } else {
          const r = (n, start = 0) => start + Math.floor(Math.random() * n);
          let h = r(window.innerHeight);
          const rw = first
            ? r(window.innerWidth)
            : r(2)
            ? window.innerWidth
            : 0;
          const w = window.innerWidth;

          let path = `M${rw},${h} C`;
          h = h - h / 10;

          while (h > 1) {
            path += `${r(w / 2, Circle.flip ? w / 2 : 0)},${h} `;
            h = h - h / 10;
            Circle.flip = !Circle.flip;
          }

          this.el = svg(
            'circle',
            {
              r: r(15, 5),
              fill: `rgba(${r(255)},${r(255)},${r(255)}, ${r(0.2, 0.6)})`,
            },
            svg('animateMotion', { dur: '10000s', repeatCount: '1', path })
          );
        }
      }
    }

    const svgView = new (class Svg {
      constructor() {
        this.active = [];
        this.el = svg('svg');
      }

      update() {
        if (this.active.length === count) return;
        if (this.active.length > count) {
          this.active
            .slice(0, this.active.length - count)
            .forEach((t) => unmount(this, t));

          this.active = this.active.slice(this.active.length - count);
          return;
        }

        while (this.active.length !== count) this.add();
      }

      add() {
        const c = new Circle();
        mount(svgView, c);
        this.active.push(c);
      }
    })();

    const input = el('input', {
      onchange() {
        const value = +input.value;
        if (!value || value == count) return void (input.value = count);

        count = Math.max(Math.min(value, max), min);
        input.value = count;
        svgView.update();
      },
      value: 100,
      min,
      max,
      style: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 1,
      },
    });

    mount(document.body, input);
    mount(document.body, svgView);
    svgView.update(true);
    first = false;
  }

  document.readyState === 'complete' || document.readyState === 'interactive'
    ? main()
    : document.addEventListener('DOMContentLoaded', main);
})();
