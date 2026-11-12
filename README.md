# L'Assiette — site officiel (Brazzaville)

Site vitrine bilingue (français par défaut, anglais) du restaurant **L'Assiette**, 01 bis avenue des Aiglons, centre-ville de Brazzaville.
Généré en HTML statique : rapide, sans base de données, hébergeable n'importe où (Netlify, Vercel, Cloudflare Pages, OVH, etc.).

## Démarrer

```bash
npm run build     # génère le site dans dist/
npm run serve     # sert dist/ sur http://localhost:4173
npm run dev       # build + rebuild automatique + serveur
npm run check     # contrôle qualité : liens cassés, alt manquants, titres/descriptions, JSON-LD
npm run images    # régénère les images WebP depuis assets/ (nécessite cwebp : brew install webp)
```

Prérequis : Node 18+. Aucune dépendance npm. `cwebp` n'est nécessaire que pour régénérer les images (les WebP générés sont déjà dans `public/img/`).

## Direction artistique

« Paris · Congo » : un site ivoire, aéré et précis, dans l'esprit des maisons parisiennes. Titres en Bodoni Moda avec un mot en italique champagne, numéros de chapitre, filets fins, petits libellés en capitales espacées, boutons pilules en petites capitales, photo plein écran avec le logotype au centre, contact en écran partagé (plan + panneau sombre). Le turquoise du logo n'apparaît qu'en touches (favicon, sélection, liens). Le logotype reprend le vrai logo du restaurant : capitales fines en Bodoni Moda et un A dessiné en tour Eiffel (SVG inline dans `src/lib.mjs`, fonction `wordmark`). Le texte courant utilise la police système (SF Pro sur Apple, Segoe UI sur Windows), donc aucune police à charger hormis Bodoni pour le logotype.

Mouvement : une seule ouverture orchestrée sur l'accueil (rideaux d'image, lettres qui montent, lent zoom), rideaux de révélation au défilement, parallaxe discrète sur la photo plein écran du soir, transitions de page natives (View Transitions API, sans bibliothèque), le tout désactivé avec `prefers-reduced-motion`. Sur mobile : barre d'actions fixe (Réserver / WhatsApp) et menu plein écran.

## Structure

```
assets/                  Photos sources (Instagram du restaurant) — jamais servies telles quelles
public/                  Fichiers copiés tels quels dans dist/ : fonts, img (WebP générés), favicon
src/
  data/site.json         Coordonnées, horaires, réseaux, WhatsApp, configuration de la réservation
  data/menu.json         La carte (catégories, plats, descriptions FR/EN, prix)
  data/images.json       Liste des photos, recadrage (pour retirer les textes incrustés) et textes alternatifs FR/EN
  i18n/fr.json, en.json  Tous les textes du site, page par page
  pages/*.mjs            Gabarits des pages (accueil, carte, à propos, galerie, contact, 404)
  partials/layout.mjs    Enveloppe HTML : <head> SEO, en-tête, pied de page, données structurées
  styles/main.css        Feuille de style (design system en variables CSS)
  js/main.js             Navigation mobile, animations, carte, galerie, formulaire de réservation
  build.mjs              Générateur statique (pages FR + EN, sitemap, robots, redirection racine)
  images.mjs             Pipeline images (recadrage + WebP en 4 tailles)
  check.mjs              Contrôles qualité
dist/                    Site généré (à déployer)
```

## URLs

| Page | Français | Anglais |
|---|---|---|
| Accueil | `/fr/` | `/en/` |
| Carte | `/fr/carte/` | `/en/menu/` |
| À propos | `/fr/a-propos/` | `/en/about/` |
| Galerie | `/fr/galerie/` | `/en/gallery/` |
| Contact & réservation | `/fr/contact-reservation/` | `/en/contact-reservations/` |

La racine `/` redirige vers la langue du navigateur (ou la dernière langue choisie), français par défaut.
Chaque page déclare `hreflang` FR/EN/x-default, un `canonical`, Open Graph/Twitter et des données structurées `Restaurant` (+ `Menu` sur la carte).

## Modifier le contenu

- **Textes** : `src/i18n/fr.json` et `src/i18n/en.json` (modifier les deux langues).
- **Carte et prix** : `src/data/menu.json`. `"price": null` affiche « Sur demande ». Les prix sont en FCFA.
- **Coordonnées / horaires** : `src/data/site.json`.
- **Photos** : déposer le fichier dans `assets/`, ajouter une entrée dans `src/data/images.json` (recadrage + alt FR/EN), lancer `npm run images`, puis utiliser le `slug` dans les pages ou la galerie (`src/pages/gallery.mjs`).

Puis `npm run build`.

## Réservation : comment ça marche

Le formulaire (`/fr/contact-reservation/`) valide les champs côté navigateur puis :

1. **Par défaut (WhatsApp)** : il ouvre WhatsApp avec un message pré-rempli (nom, téléphone, date, heure, nombre de personnes, message) vers le numéro `whatsapp` de `site.json` (`+242 05 514 2222`). Le restaurant confirme par message. Aucun serveur nécessaire.
2. **Optionnel (e-mail)** : renseigner `reservation.formEndpoint` dans `site.json` avec l'URL d'un service de formulaires (Formspree, Basin, Getform, Netlify Forms…). Le formulaire est alors envoyé en POST et le restaurant reçoit un e-mail. Sans cette URL, le mode WhatsApp est utilisé.

Un bouton « Réserver sur WhatsApp », les numéros de téléphone cliquables et l'adresse e-mail sont aussi présents.

## Informations vérifiées et à confirmer

Vérifié sur les profils Instagram et Facebook officiels (novembre 2026) :
nom et slogan « Saveurs de la vie », concept (restaurant, lounge bar, pâtisserie, glacier), adresse (01 bis avenue des Aiglons, rue de l'Amitié, en face du Royal Spice, à côté de l'Olympic Palace), horaires (lundi–dimanche 7h30–23h30), téléphones (+242 05 514 2222 / +242 06 903 2222), e-mail (lassiette242@gmail.com), lien Google Maps, services (sur place, à emporter, livraison), noms des plats photographiés.

À compléter ou confirmer par le restaurant :

- [ ] **Nom de domaine** : remplacer `url` dans `src/data/site.json` (actuellement `https://www.lassiette-brazzaville.com`, un espace réservé). Il sert au canonical, au sitemap, à l'Open Graph et aux données structurées.
- [ ] **Prix de la carte** : tous à `null` sauf trois lus sur des étiquettes de vitrine (tartelette pistache 3 000, dôme 3 000, cake vanille 1 500 FCFA). Descriptions des plats à relire.
- [ ] **WhatsApp** : confirmer que le +242 05 514 2222 reçoit bien les messages WhatsApp.
- [ ] **Histoire du restaurant** (page À propos) : année d'ouverture, fondateurs, origine du nom — un emplacement est prévu dans `about.story` des fichiers i18n.
- [ ] **Logo officiel** en SVG ou PNG haute définition : le site utilise pour l'instant un logotype redessiné (Bodoni Moda + A en tour Eiffel, fonction `wordmark` dans `src/lib.mjs`). Remplacer son contenu par le fichier officiel, ainsi que `public/favicon.svg` et `public/apple-touch-icon.png` (généré par `node src/icons.mjs`).
- [ ] **Photos en haute définition** (idéalement au format paysage pour la terrasse et la salle) : les photos actuelles proviennent d'Instagram (recadrées pour retirer les textes incrustés) ; certaines sont en 640–720 px de large.
- [ ] **Témoignages clients** : aucun avis authentique n'était disponible, la section n'a donc pas été créée.
- [ ] Envoyer `sitemap.xml` dans Google Search Console et créer/revendiquer la fiche Google Business Profile avec les mêmes informations (NAP identiques au site).

## Déploiement

- **Netlify** : connecter le dépôt, `netlify.toml` est déjà configuré (build, redirections de langue, en-têtes de cache et de sécurité, pages 404 par langue).
- **Vercel** : `vercel.json` est fourni (build, redirections de langue, en-têtes).
- **Autre hébergeur** : lancer `npm run build` et téléverser le contenu de `dist/`. Configurer si possible la redirection `/` → `/fr/` et des pages 404 (`dist/fr/404.html`, `dist/en/404.html`) ; sinon la redirection côté client dans `dist/index.html` fonctionne.

## Crédits

- Photos © L'Assiette Brazzaville.
- Police : Bodoni Moda (SIL Open Font License), auto-hébergée, pour le logotype uniquement ; police système pour le reste.
