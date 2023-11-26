const db = require('../db')
const fs = require('fs')

jest.mock('fs')

describe('db', () => {
  //afterEach就是每次执行完it函数之后再执行其中的回调函数, 不然每次都要在it里面写一遍fs.clearMocks()很麻烦
  afterEach(() => {
    fs.clearMocks()
  })
  it("can read", async () => {
    const data = [{data:'xxx', name:'handsomeBoy'}]
    //设置mock数据，模拟本地文件
    fs.setReadFileMock('/xxx', null, JSON.stringify(data) )
    const list = await db.read('/xxx')
    //toStrictEqual是严格意义上的相等，因为js中[] !== []，这个函数会让[] === []
    expect(list).toStrictEqual(data)
  })

  it("can write", async () => {
    //思路：不操作文件，往变量里面存数据，能存进去就说明write函数没问题
    let fakeFile
    fs.setWriteFileMock('/xxx', (path, data, callback) => {
      fakeFile = data
      //因为db.write是使用promise封装的，所以这里需要执行一下回调函数
      callback(null)
    })
    const data = [{title: '吃饭', done: true }]
    await db.write(data,'/xxx')
    expect(fakeFile).toBe(JSON.stringify(data) + '\n') //不要忘记回车
  })
})