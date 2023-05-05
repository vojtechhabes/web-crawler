# Web crawler

Tento Node.js program jako pavouk prochází webové stránky a sbírá o nich různá data. Tyto cenné informace jsou pak ukládány do PostgreSQL databáze a slouží jako zdroj informací pro další analýzy a výzkum.

## Dokumentace

Dokumentace tohoto projektu je dostupná na [GitHub Wiki](https://github.com/vojhab/web-crawler/wiki).

## Cíl projektu

Cílem tohoto projektu je vytvořit sofistikované kompletní řešení pro automatické procházení webových stránek, sbírání dat a jejich následné ukládání do databáze. Možnosti využití tohoto web crawlera jsou nekonečné - lze ho použít například pro vytvoření nového vyhledávače nebo pro provádění různých analýz dat.

### Vyhledávač

[Vyhledávač Ding](https://github.com/vojhab/ding-search) je vytvořený na základě tohoto projektu. Ding je vyhledávač, který využívá data získaná z tohoto web crawlera a umožňuje uživatelům vyhledávat webové stránky. Vyhledávač je stále ve vývoji a v budoucnu bude obsahovat mnoho dalších funkcí.

## Použité technologie

- [Node.js](https://nodejs.org): open-source framework pro běh JavaScriptového kódu na straně serveru
- [PostgreSQL](https://www.postgresql.org): databáze, která nabízí široké spektrum funkcí pro správu a ukládání dat a umožňuje uživatelům efektivně ukládat a vyhledávat data

### npm balíčky

V tomto projektu jsou používány následující npm balíčky:

- [node-postgres](https://www.npmjs.com/package/pg): umožňuje přístup k PostgreSQL databázi
- [cheerio](https://www.npmjs.com/package/cheerio): dokáže zpracovávat HTML stránky
- [axios](https://www.npmjs.com/package/axios): pro HTTP požadavky
- [dotenv](https://www.npmjs.com/package/dotenv): načítá proměnné z .env souboru

## Spuštění

Návod na spuštění web crawleru se nachází v [dokumentaci](https://github.com/vojhab/web-crawler/wiki/Spuštěn%C3%AD).

## Licence

Tento projekt je pod licencí [MIT](LICENSE).

## Tvůrce

[Vojtěch Habeš](https://www.github.com/vojhab)

habes.vo.2022@ssps.cz
