import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

const stripInterval = 4;
const stripDuration = 0.8;

function highlightStrip(strip: HTMLElement) {
	const mark = () => {
		const items = [...strip.children] as HTMLElement[];
		if (!items.length) return;
		const view = strip.getBoundingClientRect();
		const mid = view.left + view.width / 2;
		let active = items[0];
		let best = Number.POSITIVE_INFINITY;
		for (const item of items) {
			const rect = item.getBoundingClientRect();
			const dist = Math.abs(rect.left + rect.width / 2 - mid);
			if (dist < best) {
				best = dist;
				active = item;
			}
		}
		for (const item of items) item.classList.toggle("is-active", item === active);
	};

	mark();
	strip.addEventListener("scroll", mark, { passive: true });
	strip.addEventListener("scrollend", mark);
	return () => {
		strip.removeEventListener("scroll", mark);
		strip.removeEventListener("scrollend", mark);
	};
}

function autoStrip(strip: HTMLElement) {
	const originals = [...strip.children] as HTMLElement[];
	if (originals.length < 2) return () => {};

	const clones = originals.map((item) => {
		const clone = item.cloneNode(true) as HTMLElement;
		clone.setAttribute("aria-hidden", "true");
		strip.append(clone);
		return clone;
	});

	let timer: gsap.core.Tween | null = null;
	let tween: gsap.core.Tween | null = null;
	let paused = false;

	const loopWidth = () => {
		const firstClone = strip.children[originals.length] as HTMLElement | undefined;
		if (!firstClone) return 0;
		return firstClone.offsetLeft - originals[0].offsetLeft;
	};

	const wrap = () => {
		const width = loopWidth();
		if (width > 0 && strip.scrollLeft >= width) strip.scrollLeft -= width;
	};

	const schedule = () => {
		timer?.kill();
		if (paused || document.hidden) return;
		timer = gsap.delayedCall(stripInterval, () => {
			const card = strip.querySelector<HTMLElement>("li");
			const gap = Number.parseFloat(getComputedStyle(strip).columnGap) || 0;
			const step = (card?.offsetWidth ?? 0) + gap;
			if (step <= 1) {
				schedule();
				return;
			}
			wrap();
			tween?.kill();
			tween = gsap.to(strip, {
				scrollLeft: strip.scrollLeft + step,
				duration: stripDuration,
				ease: "power2.inOut",
				overwrite: "auto",
				onComplete: wrap,
			});
			schedule();
		});
	};

	const onVisibility = () => {
		if (document.hidden) {
			paused = true;
			timer?.kill();
			tween?.pause();
			return;
		}
		paused = false;
		tween?.resume();
		schedule();
	};

	document.addEventListener("visibilitychange", onVisibility);
	schedule();

	return () => {
		timer?.kill();
		tween?.kill();
		document.removeEventListener("visibilitychange", onVisibility);
		clones.forEach((node) => node.remove());
	};
}

function scrollToHash(hash: string) {
	const target = document.querySelector<HTMLElement>(hash);
	if (!target) return;
	if (lenis) {
		lenis.scrollTo(target, { offset: 0 });
		return;
	}
	target.scrollIntoView();
}

export function initMotion() {
	const burger = document.querySelector<HTMLButtonElement>("[data-burger]");
	const overlay = document.querySelector<HTMLElement>("[data-overlay]");
	const links = overlay ? [...overlay.querySelectorAll<HTMLAnchorElement>("a")] : [];
	const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	const finishClose = () => {
		overlay?.classList.remove("is-open");
		document.body.classList.remove("is-locked");
		lenis?.start();
	};

	const openMenu = () => {
		if (!burger || !overlay) return;
		burger.setAttribute("aria-expanded", "true");
		overlay.classList.add("is-open");
		document.body.classList.add("is-locked");
		lenis?.stop();
		if (reduce) {
			gsap.set(overlay, { autoAlpha: 1 });
			return;
		}
		gsap.to(overlay, { autoAlpha: 1, duration: 0.35, ease: "power3.out" });
		gsap.fromTo(
			links,
			{ y: 28 },
			{ y: 0, duration: 0.5, stagger: 0.07, ease: "power3.out", overwrite: "auto" },
		);
	};

	const closeMenu = (then?: () => void) => {
		if (!burger || !overlay) {
			then?.();
			return;
		}
		const wasOpen = burger.getAttribute("aria-expanded") === "true";
		burger.setAttribute("aria-expanded", "false");
		if (!wasOpen) {
			then?.();
			return;
		}
		if (reduce) {
			gsap.set(overlay, { autoAlpha: 0 });
			finishClose();
			then?.();
			return;
		}
		gsap.to(overlay, {
			autoAlpha: 0,
			duration: 0.28,
			ease: "power3.out",
			onComplete: () => {
				finishClose();
				then?.();
			},
		});
	};

	burger?.addEventListener("click", () => {
		if (burger.getAttribute("aria-expanded") === "true") closeMenu();
		else openMenu();
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") closeMenu();
	});

	document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
		anchor.addEventListener("click", (event) => {
			const hash = anchor.getAttribute("href");
			if (!hash || hash === "#") return;
			const target = document.querySelector(hash);
			if (!target) return;
			event.preventDefault();
			closeMenu(() => scrollToHash(hash));
		});
	});

	[...document.querySelectorAll<HTMLElement>(".dish-strip")].forEach((strip) => highlightStrip(strip));

	if (reduce) return;

	lenis = new Lenis();
	lenis.on("scroll", ScrollTrigger.update);
	const ticker = (time: number) => {
		lenis?.raf(time * 1000);
	};
	gsap.ticker.add(ticker);
	gsap.ticker.lagSmoothing(0);

	const mm = gsap.matchMedia();

	mm.add("(prefers-reduced-motion: no-preference)", () => {
		const circle = document.querySelector<HTMLElement>("[data-circle]");
		const opening = document.querySelector<HTMLElement>(".opening");
		if (circle && opening) {
			gsap.fromTo(
				circle,
				{ scale: 0.86 },
				{
					scale: 3.1,
					ease: "none",
					scrollTrigger: {
						trigger: opening,
						start: "top top",
						end: "+=70%",
						pin: true,
						scrub: 0.6,
						anticipatePin: 1,
					},
				},
			);
		}

	});

	[...document.querySelectorAll<HTMLElement>(".dish-strip")].forEach((strip) => autoStrip(strip));
}
