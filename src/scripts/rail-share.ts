const rail = document.getElementById("shareRail") as HTMLElement | null;
const trigger = document.getElementById("shareTrigger") as HTMLElement | null;
const url = encodeURIComponent(window.location.href);
const title = encodeURIComponent(document.title);

const fb = document.getElementById("fb") as HTMLAnchorElement | null;
if (fb) fb.href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;

const x = document.getElementById("x") as HTMLAnchorElement | null;
if (x) x.href = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;

const li = document.getElementById("li") as HTMLAnchorElement | null;
if (li) li.href = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;

if (rail) {
    rail.querySelectorAll("a").forEach(a => {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
    });
}

const openRail = () => {
    if (rail) rail.classList.add("is-open");
    if (trigger) trigger.setAttribute("aria-expanded", "true");
};

const closeRail = () => {
    if (rail) rail.classList.remove("is-open");
    if (trigger) trigger.setAttribute("aria-expanded", "false");
};

if (trigger) {
    trigger.addEventListener("click", e => {
        e.stopPropagation();
        if (rail) {
            rail.classList.contains("is-open") ? closeRail() : openRail();
        }
    });
}

document.addEventListener("click", e => {
    if (rail && !rail.contains(e.target as Node)) closeRail();
});

document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeRail();
});