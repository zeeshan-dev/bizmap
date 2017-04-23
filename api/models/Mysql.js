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
  values = values.replace(/,\s*$/, "") + ')'
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

/**
* 
* @params
* 1- name, business name (String)
* 2- location, location code (Number)
* 3- category, category code (Number)
* 4- start, query start limit (Number)
* 5- count, is count query (Boolean)
**/
MySQL.prototype.perpareSearchQuery = function(name, location, category, start, count) {
 
  var query = ' SELECT ';
  var columns = 'b.id, b.name, b.address, b.phone1, b.phone2, b.email1 as email, c.name as cityName, c.dialing_code ';

  if ( count ) {
    columns = ' COUNT(*) as total'
  }
  
  var from = ' FROM business as b ';

  query += columns + from + ' LEFT JOIN city as c ON c.code = b.cityCode ';

  if ( category != '' ) {
    query += ' LEFT JOIN business_categories as bc ' +
             ' ON bc.business_code = b.code ';
  }

  var where = ' WHERE ';

  // search on name field
  if (name !== '') {
    where += "b.name REGEXP '" + name + "'";
  }

  // CITY code
  if ( location !== '' ) {

    var and = (name == '') ? ' ' : ' AND '; 
    where += and + 'c.code = ' + location;
  }

  // Category Id
  if ( category !== '' ) {

    var and = (name == '' && location == '') ? ' ' : ' AND '; 
    where += and + 'bc.category_code = ' + category;
  }

  query = query + where + ' LIMIT ' + start + ',' + 20 + ';';
  console.log(query);
  return query;
};

MySQL.prototype.getFavouriteQuery = function(userId) {
 
  var query = ' SELECT ';
  query += 'b.id, b.name, b.address, b.phone1, b.phone2, b.email1 as email, c.name as cityName, c.dialing_code ';
  query += ' FROM business as b ';
  query += ' LEFT JOIN favourites as f ON f.businessId = b.id';
  query += ' LEFT JOIN city as c ON c.code = b.cityCode ';

  var where = ' WHERE ';

  // find on userId
  where += "f.userId = " + userId;
  query += " ORDER BY f.created_at DESC ";
  
  query = query + where + ';';
  console.log(query);
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