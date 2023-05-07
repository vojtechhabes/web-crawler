# Web crawler

Tento Node.js program jako pavouk prochází webové stránky a sbírá o nich různá data. Tyto cenné informace jsou pak ukládány do PostgreSQL databáze a slouží jako zdroj informací pro další analýzy a výzkum.

## Dokumentace

Dokumentace tohoto projektu je dostupná na [GitHub Wiki](https://github.com/vojhab/web-crawler/wiki).

## Cíl projektu

Cílem tohoto projektu je vytvořit sofistikované kompletní řešení pro automatické procházení webových stránek, sbírání dat a jejich následné ukládání do databáze. Možnosti využití tohoto web crawlera jsou nekonečné - lze ho použít například pro vytvoření nového vyhledávače nebo pro provádění různých analýz dat.

### Vyhledávač

[Vyhledávač Ding](https://github.com/vojhab/ding-search) je vytvořený na základě tohoto projektu. Ding je vyhledávač, který využívá data získaná z tohoto web crawlera a umožňuje uživatelům vyhledávat webové stránky. Vyhledávač je stále ve vývoji a v budoucnu bude obsahovat mnoho dalších funkcí.

# Použité technologie

- [Node.js](https://nodejs.org): Open-source framework pro běh JavaScriptového kódu na straně serveru.
- [PostgreSQL](https://www.postgresql.org): Databáze, která nabízí široké spektrum funkcí pro správu a ukládání dat a umožňuje uživatelům efektivně ukládat a vyhledávat data.
- [TensorFlow.js](https://www.tensorflow.org/js): Je open-source knihovna pro strojové učení a práci s neuronovými sítěmi, kterou lze použít v JavaScriptu jak v prohlížeči, tak i na straně serveru pomocí Node.js.

## npm balíčky

V tomto projektu jsou použity následující npm balíčky:

- [node-postgres](https://www.npmjs.com/package/pg): Umožňuje přístup k PostgreSQL databázi.
- [cheerio](https://www.npmjs.com/package/cheerio): Dokáže zpracovávat HTML stránky.
- [axios](https://www.npmjs.com/package/axios): Pro HTTP požadavky.
- [dotenv](https://www.npmjs.com/package/dotenv): Načítá proměnné z .env souboru.
- [@tensorflow/tfjs](https://www.npmjs.com/package/@tensorflow/tfjs): Jedná se o npm balíček pro použití knihovny TensorFlow.js v projektu.
- [@tensorflow-models/universal-sentence-encoder](https://www.npmjs.com/package/@tensorflow-models/universal-sentence-encoder): Balíček umožňující použití modelu Universal Sentence Encoder.

## Spuštění

Návod na spuštění web crawleru se nachází v [dokumentaci](https://github.com/vojhab/web-crawler/wiki/Spuštěn%C3%AD).

## Plánované změny a funkce

- [x] použít [pgvector](https://github.com/pgvector/pgvector) pro ukládání vnoření slov
- [ ] pokud není dostupný popis stránky, vytvořit ho pomocí [facebook/bart-large-cnn](https://huggingface.co/facebook/bart-large-cnn) (nebo podobného modelu)
- [ ] pokud nejsou dostupná klíčová slova stránky, extrahovat je pomocí [ml6team/keyphrase-extraction-distilbert-inspec](https://huggingface.co/ml6team/keyphrase-extraction-distilbert-inspec) (nebo podobného modelu)
- [x] použít [TensorFlow.js](https://www.tensorflow.org/js) místo Inference API k získávání vnoření slov

## Licence

Tento projekt je pod licencí [MIT](LICENSE).

## Tvůrce

[Vojtěch Habeš](https://www.github.com/vojhab)

habes.vo.2022@ssps.cz
