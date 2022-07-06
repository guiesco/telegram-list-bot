module.exports.createCommandList = (message) => {
    const messageArray = message.split(' ')
    if(messageArray.length < 4) {
        return 'Missing parameter. Message should be /create ${listName} ${listPrice} ${listMinValue}.'
    }
    return {
        command: messageArray[0],
        listName: messageArray[1],
        listPrice: parseInt(messageArray[2]),
        listMinValue: messageArray[3]
    }
}

module.exports.addCommandList = (message) => {
    const messageArray = message.split(' ')
    if(messageArray.length < 3) {
        return 'Missing parameter. Message should be [/add | /remove] ${listId} ${desiredQuantity}.'
    }
    return {
        command: messageArray[0],
        listId: messageArray[1],
        desiredQuantity: parseInt(messageArray[2])
    }
}

module.exports.singleCommandList = (message) => {
    const messageArray = message.split(' ')
    if(messageArray.length < 2) {
        return 'Missing parameter. Message should be [/close | /delete | /pay | /list] ${listId}.'
    }
    return {
        command: messageArray[0],
        listId: messageArray[1]
    }
}

module.exports.parseJsonToMessage = ({id, listName, listPrice, listMinValue, interestedPpl, totalRequested, totalPaid, amountToPay}) => {
    let message = `*${id} - ${listName} R$${listPrice} min. ${listMinValue}*`
    
    for(let ppl in interestedPpl) {
        const personObject = interestedPpl[ppl]
        const totalValue = personObject.desiredQuantity * listPrice
        const paidText = personObject.paid ? '- 💸' : ''
        message += `

        ${ppl} - ${personObject.desiredQuantity}g - R$${totalValue} ${paidText}
        `
    }

    message += `
    *Total*: ${totalRequested}g 
    *Pago*: ${totalPaid}/${amountToPay} reais`    

    return message
}