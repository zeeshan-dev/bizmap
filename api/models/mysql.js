// Constructor
function MySQL() {
  
}

// class methods
MySQL.prototype.perpareInsertQuery = function(data, table) {
  
  var query = 'INSERT INTO ' + table + ' ';

  var columns = '(';
  var values = '(';
  
  // prepare data 
  for (var key in data) {
  
    columns += key + ',';
    values += "'" + data[key] + "',";
  }

  columns = columns.replace(/,\s*$/, "") + ')';
  values = values.replace(/,\s*$/, "") + ')';
  query = query + columns + ' VALUES ' + values;
  
  return query;
};
/**
* 
* @params
* 1- db  mysql db object
* 2- query String
* 3- callback function
**/
MySQL.prototype.executeQuery = function(db, query, callback) {

  db.query( query, function insertCallback(err, result) {
    callback(err, result);
  });

};


// export the class
module.exports = MySQL;