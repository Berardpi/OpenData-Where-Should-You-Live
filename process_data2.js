var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var _ = require('lodash');
//var Promise = require('promise');

// Connection URL
var url = 'mongodb://127.0.0.1:27017/wsil';

MongoClient.connect(url, function(err, db) {
    if(err) throw err;

    
    var neighborhoods = db.collection('neighborhood').find();
        neighborhoods.each(function(err, neighborhood) {
            if (err) console.log("error");
            console.log("neighb");
            /*
            if (neighborhood != null) {
                return new Promise.all([
                    updateCitelibs(db, neighborhood),
                    updateStop(db, neighborhood),
                    updateGsm(db, neighborhood),
                    updateCyclelane(db, neighborhood)
                    ]);
                
            } else {
                resolve(neighborhood);
            }
            */
        });

    db.close();
/*
var neighborhoods = db.collection('neighborhood').findOne(function(err, doc){
    updateCitelibs(db, doc).then(function(err, doc){
        db.close();
    });


})*/
});

var updateCitelibs = function(db, neighborhood){
    console.log("hello");
    return new Promise(function(resolve, reject){
        db.collection('citelib').find({geometry: { $geoWithin: { $geometry: neighborhood.geometry } } }).count(function(err, count) {
                    if(err) reject(err);
                    return db.collection('neighborhood').update({_id: neighborhood._id}, {$set: {"properties.citelib_count": count}}, function(err, doc) {
                        if(err) reject(err);
                        resolve(doc);
                    });
                })
    });
};

var updateStop = function(db, neighborhood){
    var tram_count = 0;
    var bus_count = 0;
    var sncf_count = 0;
    var autocar_count = 0;

    return new Promise(function(resolve, reject){
        db.collection('stop').find({geometry: { $geoWithin: { $geometry: neighborhood.geometry } } }, function(err, stops) {
                return Promise.all(
                    stops.each(function(err, stop) {
                        if (stop != null) {
                            var lines = stop.properties.LIGNESARRET.split(',');
                            _.each(lines, function(line) {
                                if (line.match(/SEM_[ABCDE]/)) {
                                    tram_count += 1;
                                } else if (_.startsWith(line, 'SEM_')) {
                                    bus_count += 1;
                                } else if (_.startsWith(line, 'SNC_')) {
                                    sncf_count += 1;
                                } else {
                                    autocar_count += 1;
                                }
                            });
                            resolve(stop);
                        } else {
                            db.collection('neighborhood').update({_id: neighborhood._id}, {$set: {"properties.tram_count": tram_count, "properties.bus_count": bus_count, "properties.autocar_count": autocar_count, "properties.sncf_count": sncf_count}}, function(err, doc) {
                                if(err) reject(err);
                                resolve(doc);
                            });
                        }
                    })
                );
    })
});
};

var updateGsm = function(db, neighborhood) {
    var gsm_2g_count = 0;
                var gsm_3g_count = 0;
                var gsm_4g_count = 0;
                return new Promise(function(resolve, reject){ 
                db.collection('gsm').find({geometry: { $geoWithin: { $geometry: neighborhood.geometry } } }, function(err, gsms) {
                    return Promise.all(gsms.each(function(err, gsm) {
                        if (gsm != null) {
                            if (gsm.properties.ANT_4G == "OUI") {
                                gsm_4g_count += 1;
                            } else if (gsm.properties.ANT_3G == "OUI") {
                                gsm_3g_count += 1;
                            } else if (gsm.properties.ANT_2G == "OUI") {
                                gsm_2g_count += 1;
                            }
                            resolve(gsm);
                        } else {
                            return db.collection('neighborhood').update({_id: neighborhood._id}, {$set: {"properties.gsm_4g_count": gsm_4g_count, "properties.gsm_3g_count": gsm_3g_count, "properties.gsm_2g_count": gsm_2g_count}}, function(err, doc) {
                                if(err) reject(err);
                                resolve(doc);
                            });
                        }
                    }));
                })
});
};

var updateCyclelane = function(db, neighborhood){
    var length = 0;
                return new Promise(function(resolve, reject){
                    db.collection('cyclelane').find({geometry: { $geoWithin: { $geometry: neighborhood.geometry } } }, function(err, cyclelanes) {
                    return Promise.all(cyclelanes.each(function(err, cyclelane) {
                        if (cyclelane != null) {
                            length += cyclelane.properties.longueur_section_m;
                            resolve(cyclelane);
                        } else {
                            return db.collection('neighborhood').update({_id: neighborhood._id}, {$set: {"properties.cyclelane_length": length}}, function(err, doc) {
                                if(err) reject(err);
                                resolve(doc);
                            });
                        }
                    }));
                })
                });
};