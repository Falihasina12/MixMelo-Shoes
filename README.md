# MixMelo Shoes

MixMelo Shoes est une boutique e-commerce frontend dédiée aux chaussures de basketball. Le projet est conçu pour être fonctionnel, responsive et compatible avec GitHub Pages.

## Objectif

- présenter une collection de chaussures de basketball
- permettre la recherche et le filtrage des produits
- offrir une page produit dynamique
- gérer un panier avec localStorage
- simuler un checkout
- afficher la météo locale via Open-Meteo
- respecter les bonnes pratiques SEO et accessibilité

## Arborescence

```text
MixMelo-Shoes/
├── index.html
├── products.html
├── product.html
├── about.html
├── contact.html
├── cart.html
├── checkout.html
├── 404.html
├── css/
│   ├── style.css
│   ├── responsive.css
│   └── animations.css
├── js/
│   ├── main.js
│   ├── products.js
│   ├── product.js
│   ├── cart.js
│   ├── search.js
│   ├── filters.js
│   ├── checkout.js
│   └── weather.js
├── images/
│   ├── products/
│   ├── banners/
│   └── logo/
├── data/
│   └── products.json
├── favicon.ico
├── robots.txt
├── sitemap.xml
├── README.md
├── .gitignore
└── .nojekyll
```

## Pré-requis

- Git
- Un compte GitHub
- Un navigateur moderne

## Créer un dépôt GitHub

1. Connectez-vous à GitHub.
2. Cliquez sur New repository.
3. Nommez le dépôt `MixMelo-Shoes`.
4. Choisissez Public ou Private selon votre besoin.
5. Créez le dépôt.

## Pousser le projet avec Git

```bash
git init
git add .
git commit -m "Initialisation de MixMelo Shoes"
git branch -M main
git remote add origin URL_DU_REPOSITORY
git push -u origin main
```

## Activer GitHub Pages

1. Ouvrez le dépôt GitHub.
2. Allez dans Settings > Pages.
3. Sélectionnez la branche `main`.
4. Choisissez le dossier racine du projet.
5. Enregistrez.
6. GitHub génère alors une URL publique du type :
   `https://votre-utilisateur.github.io/MixMelo-Shoes/`

## Vérifier le site en local

Ouvrez simplement le fichier `index.html` dans le navigateur, ou lancez un serveur local :

```bash
python -m http.server 8000
```

Puis ouvrez : `http://localhost:8000`

## Google Search Console

1. Créez un compte Google Search Console.
2. Ajoutez l’URL du site GitHub Pages.
3. Vérifiez la propriété via la méthode proposée par Google.
4. Soumettez le fichier `sitemap.xml`.
5. Demandez l’indexation de la page principale.

> Google ne garantit pas un classement automatique. Le projet respecte les bonnes pratiques SEO techniques pour améliorer la visibilité.

## SEO et bonnes pratiques

- titles et meta descriptions uniques
- structure HTML sémantique
- images avec `alt`
- balises Open Graph et Twitter Card
- canonical URLs
- sitemap XML
- robots.txt
- compatibilité GitHub Pages
- fichiers CSS/JS chargés via des chemins relatifs

## APIs utilisées

- Open-Meteo Geocoding API
- Open-Meteo Weather API
- Geolocation API du navigateur
- Fetch API

## Déploiement

Le projet est conçu pour un déploiement statique sur GitHub Pages, sans backend.

## Remarques

- Les données produits sont fictives.
- Les paiements sont simulés et ne nécessitent pas de vraie carte bancaire.
- L’application reste fonctionnelle sans clé API privée.
