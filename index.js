/**
 * Comparateur de formats de sérialisation: JSON, XML et Protocol Buffers.
 * Analyse les performances d'encodage/décodage et la taille des fichiers.
 * 
 * @author Ilyas MICHICH
 * @version 1.0
 * @since 2024
 * 
 * Ce script démontre les différences entre les formats de données:
 * - JSON: Format texte lisible, largement utilisé
 * - XML: Format texte avec balises, verbeux mais structuré
 * - Protobuf: Format binaire compact et performant
 */

const systemesFichiers = require('fs');
const convertisseurXml = require('xml-js');
const protobuf = require('protobufjs');

/* 
 * Chargement du schéma Protocol Buffers
 * @author Ilyas MICHICH
 */
const schemaProtobuf = protobuf.loadSync('employee.proto');
const TypeListeEmployes = schemaProtobuf.lookupType('Employees');

console.log('============================================');
console.log('   COMPARATEUR DE FORMATS - Ilyas MICHICH  ');
console.log('============================================\n');

/* 
 * Données de test - Liste des employés
 * @author Ilyas MICHICH
 */
const listeEmployes = [];

listeEmployes.push({
  id: 1,
  name: 'Ahmed',
  salary: 12000,
  email: 'ahmed@entreprise.ma',
  is_manager: false
});

listeEmployes.push({
  id: 2,
  name: 'Fatima',
  salary: 25000,
  email: 'fatima@entreprise.ma',
  is_manager: true
});

listeEmployes.push({
  id: 3,
  name: 'Youssef',
  salary: 28000,
  email: 'youssef@entreprise.ma',
  is_manager: true
});

const objetDonnees = {
  employee: listeEmployes
};

console.log('[Ilyas MICHICH] Données de test préparées avec', listeEmployes.length, 'employés\n');

/* 
 * === TEST JSON === 
 * @author Ilyas MICHICH
 */
console.log('--- Test Format JSON ---');
console.time('[Ilyas] Encodage JSON');
const donneesJson = JSON.stringify(objetDonnees, null, 2);
console.timeEnd('[Ilyas] Encodage JSON');

console.time('[Ilyas] Décodage JSON');
const objetDecodeJson = JSON.parse(donneesJson);
console.timeEnd('[Ilyas] Décodage JSON');

/* 
 * === TEST XML === 
 * @author Ilyas MICHICH
 */
console.log('\n--- Test Format XML ---');
const optionsConversion = {
  compact: true,
  ignoreComment: true,
  spaces: 2
};

console.time('[Ilyas] Encodage XML');
const donneesXml = "<root>\n" + convertisseurXml.json2xml(objetDonnees, optionsConversion) + "\n</root>";
console.timeEnd('[Ilyas] Encodage XML');

console.time('[Ilyas] Décodage XML');
const xmlEnJson = convertisseurXml.xml2json(donneesXml, { compact: true });
const objetDecodeXml = JSON.parse(xmlEnJson);
console.timeEnd('[Ilyas] Décodage XML');

/* 
 * === TEST PROTOCOL BUFFERS === 
 * @author Ilyas MICHICH
 */
console.log('\n--- Test Format Protocol Buffers ---');

const messageErreur = TypeListeEmployes.verify(objetDonnees);
if (messageErreur) {
  throw Error('[Ilyas MICHICH] Erreur de vérification Protobuf: ' + messageErreur);
}

console.time('[Ilyas] Encodage Protobuf');
const messageProtobuf = TypeListeEmployes.create(objetDonnees);
const tamponBinaire = TypeListeEmployes.encode(messageProtobuf).finish();
console.timeEnd('[Ilyas] Encodage Protobuf');

console.time('[Ilyas] Décodage Protobuf');
const messageDecodé = TypeListeEmployes.decode(tamponBinaire);
const objetDecodeProtobuf = TypeListeEmployes.toObject(messageDecodé);
console.timeEnd('[Ilyas] Décodage Protobuf');

/* 
 * Sauvegarde des fichiers générés
 * @author Ilyas MICHICH
 */
console.log('\n--- Sauvegarde des fichiers ---');
systemesFichiers.writeFileSync('data.json', donneesJson);
systemesFichiers.writeFileSync('data.xml', donneesXml);
systemesFichiers.writeFileSync('data.proto', tamponBinaire);
console.log('[Ilyas MICHICH] Fichiers sauvegardés avec succès');

/* 
 * Comparaison des tailles de fichiers
 * @author Ilyas MICHICH
 */
const tailleFichierJson = systemesFichiers.statSync('data.json').size;
const tailleFichierXml = systemesFichiers.statSync('data.xml').size;
const tailleFichierProtobuf = systemesFichiers.statSync('data.proto').size;

console.log('\n============================================');
console.log('   RÉSULTATS - Ilyas MICHICH');
console.log('============================================');
console.log(`[Ilyas] Taille fichier JSON    : ${tailleFichierJson} octets`);
console.log(`[Ilyas] Taille fichier XML     : ${tailleFichierXml} octets`);
console.log(`[Ilyas] Taille fichier Protobuf: ${tailleFichierProtobuf} octets`);

/* 
 * Calcul des économies de taille
 * @author Ilyas MICHICH
 */
const economieVsJson = ((tailleFichierJson - tailleFichierProtobuf) / tailleFichierJson * 100).toFixed(1);
const economieVsXml = ((tailleFichierXml - tailleFichierProtobuf) / tailleFichierXml * 100).toFixed(1);

console.log('\n--- Analyse des économies ---');
console.log(`[Ilyas] Protobuf est ${economieVsJson}% plus compact que JSON`);
console.log(`[Ilyas] Protobuf est ${economieVsXml}% plus compact que XML`);

/* 
 * Vérification de la lecture du fichier binaire
 * @author Ilyas MICHICH
 */
console.log('\n--- Vérification lecture fichier .proto ---');
const tamponLecture = systemesFichiers.readFileSync('data.proto');
const messageLu = TypeListeEmployes.decode(tamponLecture);
const objetLu = TypeListeEmployes.toObject(messageLu);

console.log('[Ilyas MICHICH] Données récupérées du fichier binaire:');
console.log(JSON.stringify(objetLu, null, 2));

console.log('\n============================================');
console.log('   FIN DU COMPARATIF - Ilyas MICHICH');
console.log('============================================');
