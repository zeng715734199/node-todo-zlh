const program = require("commander")
const api = require("./index.js")
const pkg = require("./package.json")
const db = require("./db.js")

program.version(pkg.version)

program
    .command("add")
    .description("add a task")
    .action((...args) => {
        const words = args.slice(0, -1).join(" ")
        api.add(words).then(
            () => {
                console.log("添加成功")
            },
            () => {
                console.log("添加失败")
            }
        )
    })
program
    .command("clear")
    .description("clear all tasks")
    .action(() => {
        api.clear().then(
            () => {
                console.log("清除完毕")
            },
            () => {
                console.log("清除失败")
            }
        )
    })
program
    .command("remove")
    .description("remove this file")
    .action(() => db.remove().then(() => console.log("删除成功！").catch(e => console.error(e))))
    

program
    .command("read")
    .description("read this file")
    .action(() => db.read().then(res => console.log("读取成功!", res)))

program.parse(process.argv)

if (process.argv.length === 2) {
    // 说明用户直接运行 node cli.js
    void api.showAll()
}
