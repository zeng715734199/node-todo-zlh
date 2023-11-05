const db = require("./db.js")
const inquirer = require("inquirer")

module.exports.add = async title => {
    const list = await db.read() //这种db.read()的写法称为面向接口变成，先把接口想好再写，隐藏复杂操作，暴露逻辑性比较强的接口出去
    list.push({ title, done: false })
    await db.write(list)
}

module.exports.clear = async () => {
    await db.write([])
}

module.exports.showAll = async () => {
    const list = await db.read()
    const choices = generateChoices(list)

    const { index } = await selectTask(choices)

    if (index >= 0) {
        await performAction(list, index)
    } else if (index === -2) {
        await createTask()
    }
}

function generateChoices(list) {
    return [
        { name: "退出", value: -1 },
        ...list.map((item, index) => ({
            name: `${item.done ? "[✔]" : "[_]"} ${index + 1} - ${item.title}`,
            value: index,
        })),
        { name: "+ 创建任务", value: -2 },
    ]
}

async function selectTask(choices) {
    return await inquirer.prompt({
        type: "list",
        name: "index",
        message: "请选择你想操作的任务：",
        choices: choices,
    })
}

async function performAction(list, index) {
    const action = await selectAction()

    const actionMap = {
        markAsDone,
        markAsUndone,
        quit,
        updateTitle,
        removeTask,
    }

    await actionMap[action.key](list, index)
}

async function selectAction() {
    return await inquirer.prompt({
        type: "list",
        name: "key",
        message: "请选择操作：",
        choices: [
            { name: "退出", value: "quit" },
            { name: "已完成", value: "markAsDone" },
            { name: "未完成", value: "markAsUndone" },
            { name: "改标题", value: "updateTitle" },
            { name: "删除", value: "removeTask" },
        ],
    })
}

async function createTask() {
    const { title } = await inquirer.prompt({
        type: "input",
        name: "title",
        message: "请输入新任务标题：",
    })

    await module.exports.add(title)
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
    const { title } = await inquirer.prompt({
        type: "input",
        name: "title",
        message: "请输入新标题：",
        default: list[index].title, //这里支持一个默认选项，可以支持展示旧的值
    })

    list[index].title = title
    await db.write(list)
}

async function removeTask(list, index) {
    list.splice(index, 1)
    await db.write(list)
}

async function quit() {
    // Do nothing
}
