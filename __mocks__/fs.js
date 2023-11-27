const fs = jest.createMockFromModule('fs');
//使用实际的模块，把它存到_fs变量中
const _fs = jest.requireActual('fs')

let readMocks = {}

fs.setReadFileMock = (path, error, data) => {
  readMocks[path] = [error, data]
}

//fs.readFile(path, callback)
fs.readFile = (path, options, callback) => {
  //第三个参数没传
  if(callback === undefined) callback = options
  //存过路径的话劫持，把存的数据返回
  if(path in readMocks) {
    callback(...readMocks[path])
  } else _fs.readFile(path, options, callback)
}

let writeMocks = {}

fs.setWriteFileMock = (path, fn) => {
  writeMocks[path] = fn
}

fs.writeFile = (path, data, callback) => {
  //测试db.write的时候会去调用db.writeFile(path, data, callback)，所以这里参数需要全部传进fn
  if(path in writeMocks){
    writeMocks[path](path, data, callback)
  } else fs.writeFile(path, data, callback)
}

//清空Mocks数据，每次执行完测试用例记得清除一下测试数据，不然会干扰下一次测试的结果，学会清空是一个好习惯
fs.clearMocks = () => {
  readMocks = {}
  writeMocks = {}
}

module.exports = fs;