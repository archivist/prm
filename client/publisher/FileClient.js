/*
  HTTP client for talking with DocumentServer
*/
class FileClient {
  constructor(config) {
    this.config = config
    this.authClient = config.authClient
  }

  request(method, url, data, cb) {
    let request = new XMLHttpRequest();
    request.open(method, url, true)
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
    request.setRequestHeader('x-access-token', this.authClient.getSessionToken())
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        let res = request.responseText;
        if(isJson(res)) res = JSON.parse(res);
        cb(null, res);
      } else {
        return cb(new Error('Request failed. Returned status: ' + request.status))
      }
    }

    if (data) {
      request.send(JSON.stringify(data))
    } else {
      request.send()
    }
  }

  /*
    Remove a file
  */
  deleteFile(fileName, cb) {
    this.request('DELETE', this.config.httpUrl + fileName, null, cb)
  }

  /*
    Remove files
  */
  deleteFiles(fileIds, cb) {
    let files = encodeURIComponent(JSON.stringify(fileIds))
    this.request('DELETE', this.config.httpUrl + '?files=' + files, null, cb)
  }

  /*
    Upload file to the server
  */
  uploadFile(file, cb) {

    function transferComplete(e) {
      if(e.currentTarget.status === 200) {
        var data = JSON.parse(e.currentTarget.response)
        var path = '/media/' + data.name
        cb(null, path)
      } else {
        cb(new Error(e.currentTarget.response))
      }
    }

    function updateProgress(e) {
      if (e.lengthComputable) {
        //var percentage = (e.loaded / e.total) * 100;
        //self.documentSession.hubClient.emit('upload', percentage);
      }
    }

    var formData = new window.FormData()
    formData.append("files", file)
    var xhr = new window.XMLHttpRequest()
    xhr.addEventListener("load", transferComplete)
    xhr.upload.addEventListener("progress", updateProgress)
    xhr.open('post', this.config.httpUrl, true)
    xhr.send(formData)
  }

}

function isJson(str) {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

export default FileClient
