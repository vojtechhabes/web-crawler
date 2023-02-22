# Web Crawler

Web crawler napsaný Node.js, který prochází webové stránky a získává o nich různá data. Tyto data jsou poté uložena do databáze.

## Cíl

Cílem je vytvořit kompletní řešení, které bude schopno automaticky procházet webové stránky, získávat o nich data a ukládat je do databáze. Tento web crawler může být využit například k vytvoření nového vyhledávače nebo k analýze různých dat na webových stránkách.

## Použité balíčky

- **Firebase Admin** pro přístup k Firestore databázi pro ukládání dat
- **Cheerio** pro zpracování HTML stránek
- **Axios** pro HTTP požadavky

## Instalace

Nainstalujte:

- Node.js
- npm

Naklonujte tento repozitář:

```bash
  git clone https://github.com/vojhab/web-crawler.git
```

Otevřete terminál v adresáři s repozitářem nainstalujte všechny potřebné balíčky:

```bash
  npm install
```

Vytvořte soubor .env a vložte do něj tento kód a upravte si hodnoty dle svých potřeb:

```
USER_AGENT=
QUEUE_COLLECTION_NAME=
CRAWLED_COLLECTION_NAME=
```

Vytvořte nový projekt na Firebase console a zapněte Firestore databázi.

Na Firebase console vygenerujte nový private key a soubor přejmenujte na "serviceAccountKey.json". Soubor pak vložte do adresáře se staženým repozitářem.

Ve Firebase console běžte do Firestore databáze. Zde vytvořte novou kolekci pro frontu, která bude mít shodné jméno s tím, co jste nastavili v .env souboru.

## Tvůrce

- [@vojhab](https://www.github.com/vojhab)
