module.exports.createCommandList = (message) => {
    const messageArray = message.split(' ')
    const arrayLength = messageArray.length
    if(arrayLength < 4) {
        return 'Missing parameter. Message should be /create ${listName} ${listPrice} ${listMinValue}.'
    }
    return {
        command: messageArray[0],
        listName: Array.from(messageArray).splice(1, arrayLength - 3).reduce((acc, i) => acc +' '+ i, ''),
        listPrice: parseInt(messageArray[arrayLength - 2]),
        listMinValue: messageArray[arrayLength - 1]
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

module.exports.parseJsonToMessage = ({id, listName, listPrice, listMinValue, interestedPpl, totalRequested, totalPaid, amountToPay, isClosed}) => {
    const closed = isClosed ? ' - Fechada' : ''
    let message = `*${id} - ${listName} R$${listPrice} min. ${listMinValue}${closed}*`
    
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
    *Pago*: ${totalPaid}/${amountToPay} reais | ${ (totalPaid/amountToPay * 100).toFixed(2) || 0}%`

    return message
}