require('dotenv').config()
const botApi = require('node-telegram-bot-api')
const JSONdb = require('simple-json-db')

const db = new JSONdb('listDb.json')

const dbFunctions = require('./functions/dbFunctions.js').config(db)
const messageFunctions = require('./functions/messageFunctions.js')

const token = process.env.TOKEN
const actives = process.env.ACTIVES

const bot = new botApi(token, { polling: true })

bot.onText(/\/create/, (msg, matches) => {
    const chatId = msg.chat.id
    const command = messageFunctions.createCommandList(msg.text)

    if (typeof command === 'string') {
        return bot.sendMessage(chatId, command, { parse_mode: 'Markdown' })
    }

    if (!db.has(actives)) {
        dbFunctions.createActiveListsDb()
    }

    const list = messageFunctions.parseJsonToMessage(dbFunctions.createNewListItem(command, msg.from.first_name))
    return bot.sendMessage(chatId, list, { parse_mode: 'Markdown' })
})

bot.onText(/\/add/, (msg, matches) => {
    const chatId = msg.chat.id
    const command = messageFunctions.addCommandList(msg.text)

    if (typeof command === 'string') {
        return bot.sendMessage(chatId, command)
    }

    const list = dbFunctions.addQuantityToList(command, msg.from.first_name)

    if (typeof list === 'string') {
        return bot.sendMessage(chatId, list)
    }

    return bot.sendMessage(chatId, messageFunctions.parseJsonToMessage(list), { parse_mode: 'Markdown' })
})

bot.onText(/\/remove/, (msg, matches) => {
    const chatId = msg.chat.id
    const command = messageFunctions.addCommandList(msg.text)

    if (typeof command === 'string') {
        return bot.sendMessage(chatId, command, { parse_mode: 'Markdown' })
    }

    const list = dbFunctions.removeQuantityToList(command, msg.from.first_name)

    if (typeof list === 'string') {
        return bot.sendMessage(chatId, list)
    }

    return bot.sendMessage(chatId, messageFunctions.parseJsonToMessage(list), { parse_mode: 'Markdown' })
})

bot.onText(/\/close/, (msg, matches) => {
    const chatId = msg.chat.id
    const command = messageFunctions.singleCommandList(msg.text)

    if (typeof command === 'string') {
        return bot.sendMessage(chatId, command, { parse_mode: 'Markdown' })
    }

    const list = messageFunctions.parseJsonToMessage(dbFunctions.closeList(command, msg.from.first_name))

    return bot.sendMessage(chatId, list, { parse_mode: 'Markdown' })
})

bot.onText(/\/delete/, (msg, matches) => {
    const chatId = msg.chat.id
    const command = messageFunctions.singleCommandList(msg.text)

    if (typeof command === 'string') {
        return bot.sendMessage(chatId, command, { parse_mode: 'Markdown' })
    }

    const allLists = dbFunctions.deleteList(command, msg.from.first_name)

    if (typeof allLists === 'string') {
        return bot.sendMessage(chatId, allLists, { parse_mode: 'Markdown' })
    }

    message = ''
    for (let list of allLists) {
        message += messageFunctions.parseJsonToMessage(list)
    }

    return bot.sendMessage(chatId, message, { parse_mode: 'Markdown' })
})

bot.onText(/\/pay/, (msg, matches) => {
    const chatId = msg.chat.id
    const command = messageFunctions.singleCommandList(msg.text)

    if (typeof command === 'string') {
        return bot.sendMessage(chatId, command, { parse_mode: 'Markdown' })
    }

    const list = messageFunctions.parseJsonToMessage(dbFunctions.payList(command, msg.from.first_name))

    return bot.sendMessage(chatId, list, { parse_mode: 'Markdown' })
})

bot.onText(/\/lists$/, (msg, matches) => {
    const chatId = msg.chat.id
    const allLists = Object.values(dbFunctions.getAllActiveLists())
    if (allLists.length === 0) {
        return bot.sendMessage(chatId, 'There are no lists.')
    }
    let message = ''
    allLists.forEach((list) => {
        message += messageFunctions.parseJsonToMessage(list)
        message += `
        
        ---------------------------------------
        
`
    })
    return bot.sendMessage(chatId, message, { parse_mode: 'Markdown' })
})

bot.onText(/\/show_list/, (msg, matches) => {
    const chatId = msg.chat.id
    const command = messageFunctions.singleCommandList(msg.text)

    if (typeof command === 'string') {
        return bot.sendMessage(chatId, command, { parse_mode: 'Markdown' })
    }

    const list = messageFunctions.parseJsonToMessage(dbFunctions.showList(command, msg.from.first_name))
    return bot.sendMessage(chatId, list, { parse_mode: 'Markdown' })
})

bot.onText(/\/clear-all-lists/, (msg, matches) => {
    const chatId = msg.chat.id
    dbFunctions.clearAllActiveLists()
    return bot.sendMessage(chatId, 'Cleared', { parse_mode: 'Markdown' })
})

bot.onText(/\/help/, (msg, matches) => {
    const chatId = msg.chat.id
    const helpMessage = `Commands:
    /lists - show all lists
    /show_list listId - show a certain list
    /create name price minimumQuantity - create a list
    /add listId quantity - adds quantity to list
    /remove listId quantity - adds quantity to list
    /pay listId - pays a certain list
    /close listId - closes a certain list
    /delete listId - delete a certain list`
    return bot.sendMessage(chatId, helpMessage)
})
