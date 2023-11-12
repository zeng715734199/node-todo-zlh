const homedir = require("os").homedir()
const home = process.env.HOME || homedir
const p = require("path")
const fs = require("fs")
const dbPath = p.join(home, ".todo") //注意点，这里路径可以用home + '/.todo'吗？显然是不行的，因为mac用户可以使用/，但是windows系统目录不是/是\，比如C:\users\xxx，这时候会出错。得引入path

const db = {
    read(path = dbPath) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, { flag: "a+" }, (error, data) => {
                //查文档发现得使用a+，ax+都很奇怪，尽量别用，r是只读，w是只写，这些都可以在文档上看到
                if (error) return reject(error)
                let list
                try {
                    list = JSON.parse(data.toString())
                } catch (error2) {
                    list = []
                }
                resolve(list)
            })
        })
    },
    write(list, path = dbPath) {
        return new Promise((resolve, reject) => {
            const string = JSON.stringify(list)
            fs.writeFile(path, string + "\n", error => {
                if (error) return reject(error)
                resolve()
            })
        })
    },
    remove(path = dbPath) {
        return new Promise((resolve, reject) => {
            //查看路径下的文件是否存在
            if (fs.existsSync(path)) {
                //存在的话删除该文件
                fs.unlink(path, err => {
                    if (err) return reject(err)
                    resolve("删除成功~")
                })
            }else resolve(".todo文件已不存在~")
        })
    },
}
module.exports = db //这是nodejs的导出语法，意思是db里面有什么属性就导出什么属性
