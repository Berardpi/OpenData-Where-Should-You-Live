var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var _ = require('lodash');

// Connection URL
var url = 'mongodb://127.0.0.1:27017/wsil';



MongoClient.connect(url, function(err, db) {
    if(err) throw err;

    var neighborhoods = db.collection('neighborhood').find();
    neighborhoods.each(function(err, neighborhood) {
        if(err) throw err;

        if (neighborhood != null) {

            var citelibs = db.collection('citelib').find({geometry: { $geoWithin: { $geometry: neighborhood.geometry } } }).count(function(err, count) {
                if(err) throw err;
                db.collection('neighborhood').update({_id: neighborhood._id}, {$set: {"properties.citelib_count": count}}, function(err, doc) {
                    if(err) throw err;
                });
            });

            db.collection('restaurant').find({geometry: { $geoWithin: { $geometry: neighborhood.geometry } } }).count(function(err, count) {
                if(err) throw err;
                db.collection('neighborhood').update({_id: neighborhood._id}, {$set: {"properties.restaurant_count": count}}, function(err, doc) {
                    if(err) throw err;
                });
            });

            db.collection('supermarket').find({geometry: { $geoWithin: { $geometry: neighborhood.geometry } } }).count(function(err, count) {
                if(err) throw err;
                db.collection('neighborhood').update({_id: neighborhood._id}, {$set: {"properties.supermarket_count": count}}, function(err, doc) {
                    if(err) throw err;
                });
            });

            db.collection('grenoble').findOne({"id" : "relation/80348"}, {_id: 1, id:1, geometry: 1}, function(err, docToInsert) {
                if(err) throw err;
                var i = 0;
                db.collection('grenoble').remove({}, function(err, doc) {                    
                    if(err) throw err;
                    if(i++ < 1){                    
                        db.collection('grenoble').update({},docToInsert, {upsert: true}, function(err, newGrenoble) {
                            if(err) throw err;
                        });
                    }
                });
            });


            var tram_count = 0;
            var bus_count = 0;
            var sncf_count = 0;
            var autocar_count = 0;
            db.collection('stop').find({geometry: { $geoWithin: { $geometry: neighborhood.geometry } } }, function(err, stops) {
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
                    } else {
                        db.collection('neighborhood').update({_id: neighborhood._id}, {$set: {"properties.tram_count": tram_count, "properties.bus_count": bus_count, "properties.autocar_count": autocar_count, "properties.sncf_count": sncf_count}}, function(err, doc) {
                            if(err) throw err;
                        });
                    }
                });
            });

            var gsm_2g_count = 0;
            var gsm_3g_count = 0;
            var gsm_4g_count = 0;
            db.collection('gsm').find({geometry: { $geoWithin: { $geometry: neighborhood.geometry } } }, function(err, gsms) {
                gsms.each(function(err, gsm) {
                    if (gsm != null) {
                        if (gsm.properties.ANT_4G == "OUI") {
                            gsm_4g_count += 1;
                        } else if (gsm.properties.ANT_3G == "OUI") {
                            gsm_3g_count += 1;
                        } else if (gsm.properties.ANT_2G == "OUI") {
                            gsm_2g_count += 1;
                        }
                    } else {
                        db.collection('neighborhood').update({_id: neighborhood._id}, {$set: {"properties.gsm_4g_count": gsm_4g_count, "properties.gsm_3g_count": gsm_3g_count, "properties.gsm_2g_count": gsm_2g_count}}, function(err, doc) {
                            if(err) throw err;
                        });
                    }
                });
            });

            var length = 0;
            db.collection('cyclelane').find({geometry: { $geoWithin: { $geometry: neighborhood.geometry } } }, function(err, cyclelanes) {
                cyclelanes.each(function(err, cyclelane) {
                    if (cyclelane != null) {
                        length += cyclelane.properties.longueur_section_m;
                    } else {
                        db.collection('neighborhood').update({_id: neighborhood._id}, {$set: {"properties.cyclelane_length": length}}, function(err, doc) {
                            if(err) throw err;
                        });
                    }
                });
            });
        } else {
            // db.close();
        }
    });
});