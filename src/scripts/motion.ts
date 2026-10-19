import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

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

	const brand = document.querySelector<HTMLElement>(".brand");
	const openingMark = document.querySelector<HTMLElement>(".opening");
	if (brand && openingMark) {
		ScrollTrigger.create({
			trigger: openingMark,
			start: "bottom 72px",
			toggleClass: { targets: brand, className: "is-compact" },
		});
	}

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

		const plates = gsap.utils.toArray<HTMLElement>("[data-plate]");
		if (plates.length) {
			gsap.fromTo(
				plates,
				{ rotation: (index) => [-5, -3, 3, 5][index] ?? 0 },
				{
					rotation: 0,
					duration: 0.9,
					ease: "power3.out",
					scrollTrigger: {
						trigger: "#dishes",
						start: "top 78%",
						toggleActions: "play none none none",
					},
				},
			);
		}

	});
}
