# Web crawler

Tento Node.js program jako pavouk prochází webové stránky a sbírá o nich různá data. Tyto cenné informace jsou pak ukládány do PostgreSQL databáze a slouží jako zdroj informací pro další analýzy a výzkum.

## Cíl projektu

Cílem tohoto projektu je vytvořit sofistikované kompletní řešení pro automatické procházení webových stránek, sbírání dat a jejich následné ukládání do databáze. Možnosti využití tohoto web crawlera jsou nekonečné - lze ho použít například pro vytvoření nového vyhledávače nebo pro provádění různých analýz dat.

## Použité technologie

- Node.js
- PostgreSQL

## Použité npm balíčky

- **pg** pro přístup k PostgreSQL databázi
- **Cheerio** pro zpracování HTML stránek
- **Axios** pro HTTP požadavky
- **Dotenv** pro načítání proměnných z .env souboru

## Použití

Co budete potřebovat:

- Nainstalované **Node.js**
- **PostgreSQL** databázi
- Nainstalovaný **Git**
- Libovolný **editor kódu**

Naklonujte tento repozitář:

```bash
  git clone https://github.com/vojhab/web-crawler.git
```

Otevřete terminál v adresáři s repozitářem nainstalujte všechny potřebné balíčky:

```bash
  npm install
```

Vytvořte .env soubor, vložte do něj tento kód a doplňte hodnoty dle svých potřeb:

```
USER_AGENT=
DB_USER=
DB_HOST=
DB_NAME=
DB_PASSWORD=
DB_PORT=
```

V PostgreSQL databázi vytvořte tabulku s názvem "crawled", která bude sloužit pro ukládání imformací o nalezených webech:

```sql
CREATE TABLE crawled (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
  url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  keywords TEXT,
  headings TEXT[],
  links TEXT[]
);
```

Dále vytvořte tabulku s názvem "queue", která bude sloužit pro ukládání odkazů, které ještě nebyly procházeny:

```sql
CREATE TABLE queue (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
  url TEXT NOT NULL
);
```

Nakonec vložte do tabulky "queue" odkaz, na kterém má web crawler začít:

```sql
INSERT INTO queue (url) VALUES ('https://www.example.com');
```

## Tvůrce

[Vojtěch Habeš](https://www.github.com/vojhab)

habes.vo.2022@ssps.cz
