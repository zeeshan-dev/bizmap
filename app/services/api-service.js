  app.service('Api', ['$http', '$q', function($http, $q) {


  function Api() {
    this.timeOut = 60000;
  };

  /**
   * post data to server
   *
   * @params:
   *
   * 1- serverUrl: String
   * 2- data: Json object
   * 3- headers: object
   **/
  Api.prototype.post = function(serverUrl, data, headers) {


    var myObj = this;

    var deffered = $q.defer();

    $http({
      method: 'POST',
      url: serverUrl + myObj.PostFormURL,
      timeout: myObj.timeOut,
      headers: headers,
      data: data
    }).
    success(function(data) {
      deferred.resolve({
        data:data
        status: status
      });
    }).
    error(function(msg, code) {

      deferred.reject(msg);
      console.log(msg, code);
    });
    return deferred.promise;
  };


  /**
   * get form data from server
   *
   * @params:
   *
   * 1- serverUrl: String
   * 2- callback: function
   **/
  Api.prototype.get = function(serverUrl) {

    var myObj = this;

    var deferred = $q.defer();

    $http.get(serverUrl).
    success(function(data, status, headers, config) {

      deferred.resolve({
        data:data
        status: status
      });
    }).
    error(function(msg, code) {

      deferred.reject(msg);
      console.log(msg, code);
    });

    return deferred.promise;
  };

  Api.prototype.postFilePhoto = function ( serverURL, token, imageObject, callback ) {
     
    var myObj = this;
    var promises = [];

    angular.forEach(imageObject, function(image) {
      
      var deffered = $q.defer();
      var promise = $http({
        method: 'POST',
        url: serverURL + 'api/form/postPhoto',
        timeout: myObj.timeOut,
        headers: {
          'Content-Type': undefined
        },
        //This method will allow us to change how the data is sent up to the server
        // for which we'll need to encapsulate the model data in 'FormData'
        transformRequest: function(data) {

          var formData = new FormData();
          formData.append("token", token);
          var uuid = data.model.uuid;
          var filename = data.model.filename;
          var imagedata = data.model.imageData;

          //check if one if these are not null or empty 
          if( (uuid != null && uuid != '') && ( filename != null && filename != '') && ( imagedata != null && imagedata != '') ) {

            var dataURI = imagedata;
            var blob = Utils.dataURItoBlob(dataURI);

            formData.append("file[]", blob, filename);
            delete data.model.imageData;
            
          }

          formData.append("data", angular.toJson(data.model));
          return formData;
        },
        //Create an object that contains the model which will be transformed
        // in the above transformRequest method
        data: {
          model: image
        }
      }).
      success(function(data) {
        deffered.resolve(data);
      }).
      error(function(error) {
        deffered.reject();
      });
      // push all http requests in array
      promises.push(promise);

    }); // end of foreach

    // will be called once all requests are executed 
    $q.all(promises).then(function(results) {

      callback(results);
    });
  };

  return new Api();

}]);