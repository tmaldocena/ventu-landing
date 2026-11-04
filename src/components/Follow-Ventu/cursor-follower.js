/** Resolve a pointer into one of nine image directions, with boundary hysteresis. */
export function cursorDirection(dx, dy, previous = 'center', deadZone = 36) {
  if (Math.hypot(dx, dy) <= deadZone) return 'center';
  const directions = [
    'right',
    'down-right',
    'down',
    'down-left',
    'left',
    'up-left',
    'up',
    'up-right'
  ];
  const angle = Math.atan2(dy, dx);
  const previousIndex = directions.indexOf(previous);
  if (previousIndex >= 0) {
    const difference = angle - (previousIndex * Math.PI) / 4;
    if (
      Math.abs(Math.atan2(Math.sin(difference), Math.cos(difference))) <
      Math.PI / 8 + 0.1
    )
      return previous;
  }
  return directions[(Math.round(angle / (Math.PI / 4)) + 8) % 8];
}

/**
 * Mount a standalone cursor follower. No framework, API key, or animation library.
 * @param {HTMLElement} container
 * @param {{frames: Record<string, string>, size?: number, label?: string, onDirection?: (direction: string) => void}} options
 */
export function mountCursorFollower(container, options) {
  const image = document.createElement('img');
  image.alt = options.label || 'Mascot';
  image.draggable = false;
  image.src = options.frames.center;
  image.style.cssText =
    'display:block;width:100%;height:100%;object-fit:contain;pointer-events:none;user-select:none';
  const wrapper = document.createElement('span');
  wrapper.style.cssText = 'display:block;aspect-ratio:1;max-width:100%';
  wrapper.style.width = `${Math.max(64, Math.min(640, options.size || 160))}px`;
  wrapper.append(image);
  container.append(wrapper);
  const preloads = Object.values(options.frames).map((url) => {
    const img = new Image();
    img.src = url;
    return img;
  });
  let current = 'center',
    tracking = true,
    frame = 0;
  /** @type {{x:number,y:number}|null} */
  let pointer = null;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  function show(direction) {
    if (!options.frames[direction]) return;
    if (current !== direction) image.src = options.frames[direction];
    current = direction;
    options.onDirection?.(direction);
  }
  function update() {
    frame = 0;
    if (!tracking || !pointer || !fine.matches || reduced.matches) return;
    const rect = wrapper.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    show(
      cursorDirection(
        pointer.x - rect.left - rect.width / 2,
        pointer.y - rect.top - rect.height / 2,
        current
      )
    );
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }
  function move(event) {
    if (event.pointerType === 'touch') return;
    pointer = { x: event.clientX, y: event.clientY };
    schedule();
  }
  function leave() {
    pointer = null;
    if (tracking) show('center');
  }
  function preferences() {
    if (!fine.matches || reduced.matches) show('center');
    else schedule();
  }
  window.addEventListener('pointermove', move, { passive: true });
  window.addEventListener('scroll', schedule, { passive: true, capture: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('blur', leave);
  document.documentElement.addEventListener('pointerleave', leave);
  fine.addEventListener('change', preferences);
  reduced.addEventListener('change', preferences);
  return {
    setDirection: show,
    setTracking(value) {
      tracking = value;
      if (tracking) {
        show('center');
        schedule();
      }
    },
    destroy() {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('scroll', schedule, true);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('blur', leave);
      document.documentElement.removeEventListener('pointerleave', leave);
      fine.removeEventListener('change', preferences);
      reduced.removeEventListener('change', preferences);
      wrapper.remove();
      preloads.length = 0;
    }
  };
}
