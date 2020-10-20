This is how the client (browser app or android app, likewise):

- When the app is opened, the content is pulled either from localStorage or local database.
- Add new note: note is locally stored
- Edit note: edits are locally stored
- Delete note: a note is locally removed

**
Synchronize app with a mongodb database by clicking a "Synchronize" button.
Notes will be sent to the database by using API. Notes will be matched (adding, editing or removing) by using id attribute.
Locally generated new note will be given a null id, but when stored to the remote database, proper id will be generated in mongodb.

**
