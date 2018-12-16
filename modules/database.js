const {app, ipcMain} = require('electron');
const storage = require('electron-storage');
const datastore = require('nedb');
const path = require('path');

const dbPath = path.join(app.getPath('userData'), 'storage.db');
const db = new datastore({ filename: dbPath });
db.loadDatabase(function (err) {    
  // Now commands will be executed
});

db.ensureIndex({ fieldName: 'block' }, function (err) {
  // If there was an error, err is not null
});
  
ipcMain.on('storeTransaction', (event, arg) => {
  db.update({ block: arg.block, fromaddr: arg.fromaddr, toaddr: arg.toaddr }, arg, { upsert: true }, function (err, numReplaced, upsert) {
    // do nothing for now
  });
});
  
ipcMain.on('getTransactions', (event, arg) => {
  db.find({}).sort({ block: 1 }).exec(function (err, docs) {
    ResultData = [];
    
    for (i = 0; i < 500; i++) {
      ResultData.push([
        docs[i].block,
        docs[i].timestamp,
        docs[i].fromaddr,
        docs[i].toaddr,
        docs[i].value
      ]);
    }

    // return the transactions data
    event.returnValue = ResultData;
  });
});
  
ipcMain.on('getJSONFile', (event, arg) => {
  storage.get(arg, (err, data) => {
    if (err) {
      event.returnValue = null;
    } else {
      event.returnValue = data;
    }
  });        
});

ipcMain.on('setJSONFile', (event, arg) => {
  storage.set(arg.file, arg.data, (err) => {
    if (err) {
      event.returnValue = { success: false, error: err };
    } else {
      event.returnValue = { success: true, error: null };
    }
  });
});  