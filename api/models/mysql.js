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
MySQL.prototype.perpareSelectQuery = function(table, columns, start, limit) {
  
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

  if ( start && start > 0 && limit && limit > 0 ) {
    query = query + ' LIMIT ' + start + ',' + limit;
  }

  return query;
};

// prepare search query
MySQL.prototype.perpareSearchQuery = function(table, columns, start, searchKey) {
  
  var query = 'SELECT * FROM ' + table;
  var where = ' WHERE ';

  // prepare data 
  for (var i=0; i<columns.length; i++) {
    where += columns[i] + " REGEXP '" + searchKey + "' OR ";
  }

  where = where.replace(/OR\s*$/, "");
  query = query + where + ' LIMIT ' + start + ',' + 10 + ';';
  
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