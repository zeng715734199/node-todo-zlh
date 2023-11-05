const db = require("./db.js")
const inquirer = require("inquirer")

module.exports.add = async title => {
    // 读取之前的任务
    const list = await db.read() //这种db.read()的写法称为面向接口变成，先把接口想好再写，隐藏复杂操作，暴露逻辑性比较强的接口出去
    // 往里面添加一个 title 任务
    list.push({ title, done: false })
    // 存储任务到文件
    await db.write(list)
}

module.exports.clear = async () => {
    await db.write([])
}

module.exports.showAll = async () => {
    const list = await db.read()
    inquirer
        .prompt({
            type: "list",
            name: "index",
            message: "请选择你想操作的任务：",
            choices: [
                { name: "退出", value: -1 },
                ...list.map((item, index) => ({
                    name: `${item.done ? "[✔]" : "[_]"} ${index + 1} - ${item.title}`,
                    value: index,
                })),
                { name: "+ 创建任务", value: -2 },
            ],
        })
        .then(answer => {
            if (answer.index >= 0) {
                const actionArr = [
                    { name: "退出", value: "quit" },
                    { name: "已完成", value: "markAsDone" },
                    { name: "未完成", value: "markAsUndone" },
                    { name: "改标题", value: "updateTitle" },
                    { name: "删除", value: "removeTask" },
                ]
                inquirer
                    .prompt({
                        type: "list",
                        name: "key",
                        message: "请选择操作：",
                        choices: actionArr,
                    })
                    .then(action => {
                        const actionMap = {
                            markAsDone,
                            markAsUndone,
                            quit(list, index) {},
                            updateTitle,
                            removeTask,
                        }
                        actionMap[action.key](list, answer.index)
                    })
            } else if (answer.index === -2) {
              inquirer
              .prompt({
                  type: "input",
                  name: "title",
                  message: "请输入新任务标题：",
              })
              .then(async answer => {
                await this.add(answer.title) 
              })
            }
        })
}

async function markAsDone(list, index) {
    list[index].done = true
    await db.write(list)
}

async function markAsUndone(list, index) {
    list[index].done = false
    await db.write(list)
}

async function updateTitle(list, index) {
    inquirer
        .prompt({
            type: "input",
            name: "title",
            message: "请输入新标题：",
        })
        .then(async answer => {
            list[index].title = answer.title
            await db.write(list)
        })
}

async function removeTask(list, index) {
    list.splice(index, 1)
    await db.write(list)
}
