# **App Name**: Moodle API Explorer

## Core Features:

- Configuration Management: Configuration page with a form to set the Moodle API URL, API Key, and application language (English, Italian, German, Japanese).
- API Data Synchronization: Automatic fetching and updating of Moodle API function information (name, description, parameters, parameter types, and possible values) from the official Moodle documentation or API. The data is stored in the Functions and Parameters tables and refreshed every 24 hours.
- Dynamic Form Generation: Dynamic form generation in the Call page based on the selected Moodle API function. Displays the function signature, description, and input fields for each parameter. Input fields are either text inputs or select dropdowns based on the parameter type.
- API Call Execution: API call execution based on the form data submitted by the user. Stores the request, response, and timestamps in the Logs table.
- API Call History and Display: Display of the last API request and response in a formatted and readable manner, along with a paginated HTML table showing the history of API calls with options to view details, try again, or delete entries from the Logs table.

## Style Guidelines:

- Primary color: A calm blue (#3498db) for the header and main sections.
- Secondary color: Light gray (#f2f2f2) for backgrounds to provide contrast.
- Accent: A vibrant green (#2ecc71) for interactive elements like buttons and select dropdowns.
- Clean and readable sans-serif font for the main content.
- Simple and consistent icons for navigation and actions.
- Use a clear, two-column layout for the Call page, with the form on the left and the results/logs on the right.

## Original User Request:
Prepara una nuova Applicazione scegliendo le tecnologie che preferisci. Comunicami poi che stack hai utilizzato.

Nel descriverti l'Applicazione utilizzaerò dei termini in lingua Inglese, in maiuscolo. Questi termini sono oggetti, come tabelle del database relazionale o oggetti grafici nel DOM. I nomi degli oggetti sono importanti e non vanno tradotti.

Per potere costruire l'Applicazione, abbiamo innanzitutto bisogno di una certa strtuttura dati in un Database relazionale. Abbiamo una tabella Functions che contiene i nomi di TUTTE le funzioni chiamabili dalle API di Moodle. Poi abbiamo una tabella Parameters che contiene tutti i possibili parametri che ciascuna funzione può avere e, per quelli che sono a loro volta delle selezioni da una lista, contiene la lista di tutti i possibili valori. Abbiamo quindi anche una tabella che mette in relazione ciascuna Function con i propri possibili Parameters. Oltre a queste tabelle ce ne sono altre, come per esempio Config, che mantiene memorizzate le impostazioni della nostra Applicazione. Al momento non abbiamo tabelle per gestire l'autenticazione e gli Utenti: supponiamo di avere un solo Utente pubblico, che non deve nemmeno autenticarsi e può utilizzare tutte le funzionalità dell'Applicazione. Al momento la nostra Applicazione dovrà dialogare solo con un Moodle esterno (è a sua volta un'Applicazione Web, che sta su un mio server), ma in futuro sarà possibile che vi sia più di una Applicazione Web esterna, che potrebbero essere non solo Applicazioni Web Moodle, ma anche altri tipi di Applicazioni Web, ciascuna con il proprio sistema di API: per ora, non ci curiamo di questo aspetto. Infine, abbiamo una tabella Logs che contiene i dati (timestamp chiamata, timestamp risposta, Request in JSON e Response in JSON) delle varie chiamate API che l'Utente ha eseguito.

Ci aspettiamo che la tabella Functions sia piuttosto grande, con centinaia di righe. Per ciascuna riga, a cui corrisponde una funzione delle API di Moodle, dobbiamo sapere:
- una descrizione testuale
- quali Parameters accetta
- di che tipo sono i Parameters e, in caso si tratti di parametri selezionabili, quali sono i loro possibili valori.

Per esempio, per la Function core_user_get_users_by_field, la documentazione ufficiale dice che:
- la descrizione è 
"Retrieve users' information for a specified unique field - If you want to do a user search, use core_user_get_users() or core_user_search_identity()."
- ci sono due parametri, 'field' e 'values'.
- i possibili valori di 'field' sono 'id', 'idnumber', 'username' e 'email' e la sua presenza è obbligatoria, mentre il valore di 'values' è un vettore di stringhe, e anch'esso è obbligatorio.

Io non ho un'idea chiara di come sia possibile popolare queste tabelle: forse potremmo fare scraping di informazioni dalla documentazione ufficiale di Moodle, o forse esiste una chiamata API ad una specifica funzione (o più di una) che restituisce le informazioni necessarie al popolamento. In ogni caso, terrei queste informazioni memorizzate nel database per 24h al massimo, forzando il loro aggiornamento in modo automatico da una fonte ufficiale una volta al giorno. All'apertura dell'Applicazione viene quindi valutato se sono passate più di 24h rispetto alla creazione/aggiornamento di queste tabelle: in caso di risposta negativa, il loro contenuto viene preso per buono ed utilizzato per l'esecuzione dell'Applicazione; in caso di risposta positiva, il loro contenuto viene cancellato e sostuito con informazioni attuali, prese dalla fonte ufficiale.

In frontend, abbiamo due pagine, Call e Config. Le due pagine seguono lo stesso tema grafico e sono collegate da un menù.

In Config un piccolo Form fisso permette all'Utente di definire le impostazioni della tabella Config che servono all'Applicazione, come la lingua del front-end dell'Applicazione che stiamo scrivendo, l'URL delle API della mia Applicazione Moodle, ed il token necessario per l'autenticazione. Se ritieni necessarie altre impostazioni o se si rivelerà necessario aggiungerne altre in futuro, dovranno essere aggiunte alla tabella Config e lasciate modificare all'Utente qui, in questa pagina. Lo scopo di tutto questo è permettere il collaudo delle varie funzioni nelle API di Moodle, e nello specifico esaminare le risposte, quindi vedi tu se manca qualche impostazione per raggiungere questo scopo. Si vogliono testare le API chiamabili via token e non quelle chiamabili con Nome Utente e Password, per una questione di permessi. Il Form nella pagina Config è precompilato con i valori attuali (presi dal Database) di queste impostazioni, tutti in testo in chiaro (no finti asterischi o pallini!) e, quando inviato, aggiorna la singola riga della tabella Config con quanto contengono i suoi campi di input, se almeno uno di essi ha subito modifiche.

Let me explain this in English, in detail, because it is really important:
when the User clicks the "Save Configuration" button in the Configuration page, the content of the three input fields must be saved in the database, in the Config table. The table is called 'Config', for real. The table is not called 'Configuration' or 'Configurazione' or some other bullshit. It's called 'Config'. If you named it differently, please rename it to Config. The Config table has 5 columns, at least:
- id: the classic table unique key, handled just like any other id in the world
- url: stores the first of the Form's values. It is my Moodle's API URL, and it is needed by the first Form in the Call page to call the correct Moodle APIs, i. e. my very own Moodle installation.
- apiKey: stores the second of the Form's value. This value is the Moodle API key, and it is needed by the Form in the Call page ("Call API", as you called in the menu) to call my Moodle's API.
- language: stores the third of the Config's Form values, which is the Application's language.
- lastModification: stores the datetime of the last time the User upserted thir record, i.e. the last time he saved the Form in the Config page.

Since, for now, we handle a single external Moodle installation (my Moodle), we will have at most one line in the Config table. When editing and saving the Config Form, it is always that line that gets upserted. The first time the Form is saved, that line would not be present in the Config table as the Config table would be empty, and it should be inserted with (id = 1). Subsequently the line with id = 1 would already be in the Config table, and it would simply be updated.

I would also like to specify that the third of the Config's Form input fields is a select. The options should be: English, Italian, German and Japanese. When switching to an option, the entire Application must be translated to the selected Language. Of course by "the entire Application" I mean the human-readable static text: do not translate the actual Functions in the Functions Select of the Call page, and do not translate the DOM properties such ad id, name and other non-human-readable ones, which need to remain in English and need to stay the same all the time.

When loading the Config page, its Form should be auto-filled with the values found in the first and only line of the Config table, if there is such a line. This is a way for the User to understand if the Application is already configured or not.

La pagina Call è dominata da una grande Select a singola selezione, istanziata con la libreria Select2 (o altra che implementi le stesse funzionalità) in modo che l'Utente possa cercare l'opzione che preferisce scrivendo nella casella di ricerca parte del testo dell'opzione. La Select è popolata con la lista delle Functions presa dalla tabella Functions. Alla selezione di una certa Function, sotto alla Select viene disegnato dinamicamente un Form, con queste componenti:
- la firma della Function.
- la descrizione della Function.
- Un campo di input per ogni possibile Parametro, accompagnato dalla sua etichetta/nome ufficiale. Se il Parametro accetta solo valori fissi, il campo di input sarà una Select contenente i possibili valori, altrimenti sarà un campo di input testuale.
- Un bottone "Invia" per segnalare la fine della compilazione del Form.
Alla pressione del bottone "Invia" (submit), l'Applicazione dovrà eseguire una chiamata API alla Funzione selezionata, con i Parametri forniti nel Form. La Request, la Response ed i loro timestamp devono venire salvati nella tabella Logs.

Sotto al Form, sempre nella pagina Call, è presente uno Specchietto che mostra l'ultima Request inviata e la Response ricevuta. Entrambe devono essere ben formattate e leggibili dall'Utente, che è un essere umano.

Sotto allo Specchietto è presente una tabella HTML che rappresenta il contenuto della tabella di database Logs: ogni riga contiene i dati riassuntivi (timestamp Request, timestamp Response, nome Funzione, Parametri e loro valori solo se presenti, trimmando dove necessario) di una chiamata effettuata in passato, compresa l'ultima che è mostrata anche nello Specchietto. Ogni riga contiene anche tre bottoni: 'View', 'Try again' e 'Delete'. View mette i dati di quella riga, per esteso, nello Specchietto. 'Try again' preseleziona la Funzione corretta nella Select in cima alla pagina e compila i campi del Form che compare con i valori che i Parametri avevano in quella riga di Logs. 'Delete' cancella la riga di Logs ed eventualmente pulisce anche lo Specchietto se la riga mostrata nello Specchietto è la stessa che è appena stata cancellata. Questa tabella HTML è paginata e mostra solo le ultime 10 (?) righe di Logs.
  