// Constructor
function MySQL() {
  
}

// prepare insert query
MySQL.prototype.perpareInsertQuery = function(table, data) {
  
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

// prepare select query
MySQL.prototype.perpareSelectQuery = function(table, columns, limit) {
  
  var query = '';
  
  if ( columns.length === 0 ) {
    query = 'SELECT * FROM ' + table;
  } else {

    var fetchColumns = '';
    // prepare data 
    for (var column in columns) {
      fetchColumns += column + ',';
    }

    fetchColumns = fetchColumns.replace(/,\s*$/, "");

    query = 'SELECT '+ fetchColumns +' FROM ' + table;
  }

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

  db.query( query, function queryCallback(err, result) {
    callback(err, result);
  });

};


// export the class
module.exports = MySQL;