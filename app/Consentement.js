"use client";
import { useEffect, useState } from "react";

// Identifiant de mesure Google Analytics 4 (public, visible dans le code de toute page)
const GA_ID = "G-N5QNRL64XR";
const CLE = "sibcod-consent";

function chargerAnalytics() {
  if (window.__gaCharge) return;
  window.__gaCharge = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID);
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
  document.head.appendChild(s);

  // Clics sortants : Pictorem (achat) et contacts (WhatsApp, Instagram, Facebook)
  document.addEventListener("click", (e) => {
    const a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
    if (!a || !window.gtag) return;
    const h = a.hostname || "";
    let canal = null;
    if (h.endsWith("pictorem.com")) canal = "pictorem";
    else if (h === "wa.me") canal = "whatsapp";
    else if (h.endsWith("instagram.com")) canal = "instagram";
    else if (h.endsWith("facebook.com")) canal = "facebook";
    if (!canal) return;
    // Emplacement du lien et œuvre visée (identifiant Pictorem lu dans l'adresse)
    let emplacement = "autre";
    if (a.classList.contains("buybig")) emplacement = "fiche";
    else if (a.classList.contains("buy")) emplacement = "galerie";
    else if (a.closest(".pictorem")) emplacement = "bandeau";
    else if (a.closest(".top")) emplacement = "menu";
    else if (a.closest(".foot")) emplacement = "pied";
    const idPictorem = (a.pathname.match(/^\/(\d+)\//) || [])[1] || "";
    window.gtag("event", canal === "pictorem" ? "pictorem_click" : "contact_click", {
      canal,
      link_url: a.href,
      page_path: window.location.pathname,
      emplacement,
      oeuvre_pictorem: idPictorem,
    });
  });
}

function lire() {
  try { return window.localStorage.getItem(CLE); } catch { return null; }
}
function ecrire(v) {
  try { window.localStorage.setItem(CLE, v); } catch {}
}

export default function Consentement() {
  const [visible, setVisible] = useState(false);
  const [fr, setFr] = useState(false);

  useEffect(() => {
    const estFr = new URLSearchParams(window.location.search).get("lang") === "fr";
    setFr(estFr);
    document.documentElement.lang = estFr ? "fr" : "en";
    const choix = lire();
    if (choix === "oui") chargerAnalytics();
    else if (choix !== "non") setVisible(true);
  }, []);

  if (!visible) return null;

  const t = fr
    ? { txt: "Nous mesurons l'audience du site (Google Analytics) pour l'améliorer. Acceptez-vous ces cookies ?", oui: "Accepter", non: "Refuser" }
    : { txt: "We measure site traffic (Google Analytics) to improve it. Do you accept these cookies?", oui: "Accept", non: "Decline" };

  const choisir = (v) => {
    ecrire(v);
    setVisible(false);
    if (v === "oui") chargerAnalytics();
  };

  return (
    <div className="consent" role="dialog" aria-label="Cookies">
      <p>{t.txt}</p>
      <div className="consent-btns">
        <button type="button" onClick={() => choisir("non")}>{t.non}</button>
        <button type="button" className="ok" onClick={() => choisir("oui")}>{t.oui}</button>
      </div>
    </div>
  );
}
