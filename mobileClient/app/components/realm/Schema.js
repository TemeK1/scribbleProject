// Realm Schema for Note
export const Note = {
  name: 'Note',
  primaryKey: 'time',
  properties: {
    time:  'int',
    lastEdited: 'int',
    order: 'int',
    title: 'string',
    text: 'string',
    color: 'string',
    left: 'int',
    top: 'int',
  }
};
