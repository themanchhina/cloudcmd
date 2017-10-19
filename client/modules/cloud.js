/* global CloudCmd, filestack */

'use strict';

CloudCmd.Cloud = CloudProto;

const exec = require('execon');
const {log} = CloudCmd;

const fullstore = require('fullstore/legacy');
const squad = require('squad');
const currify = require('currify');

const load = require('../dom/load');
const Files = require('../dom/files');
const Images = require('../dom/images');
const {
    time,
    timeEnd,
} = require('../../common/util');

const upload = currify(_upload);
const getFilesUploaded = ({filesUploaded}) => filesUploaded;
const map = currify((fn, items) => items.map(fn));

const uploadToServer = currify((fn, res) => {
    const uploadAll = map(upload(fn));
    const process = squad(uploadAll, getFilesUploaded, log)
    
    return process(res);
});

const FSClient = fullstore();

function CloudProto(callback) {
    loadFiles(callback);
    
    return module.exports;
}

module.exports.uploadFile = (filename, data) => {
    const mimetype = '';
    const fsClient = FSClient();
    
    filepicker.store(data, {
        mimetype,
        filename,
    }, (fpFile) => {
        log(fpFile);
        filepicker.exportFile(fpFile, log, log);
    });
};

module.exports.saveFile = (callback) => {
    const fsClient = FSClient();
    const fromSources = [
        'local_file_system',
        'imagesearch',
        'googledrive',
        'dropbox',
        'box',
        'github',
        'gmail',
        'onedrive',
        'clouddrive',
        'customsource',
    ]
    
    fsClient.pick({fromSources})
        .then(uploadToServer(callback));
};

function _upload(callback, file) {
    const {
        url,
        filename,
    } = file;
    
    const responseType = 'arraybuffer';
    const success = exec.with(callback, filename);
    
    load.ajax({
        url,
        responseType,
        success,
    });
}

function loadFiles(callback) {
    time('filepicker load');
    const js = 'https://static.filestackapi.com/v3/filestack.js';
    
    load.js(js, () => {
        Files.get('modules', (error, modules) => {
            const {key} = modules.data.FilePicker;
            
            FSClient(filestack.init(key));
            
            Images.hide();
            timeEnd('filepicker loaded');
            exec(callback);
        });
    });
}

