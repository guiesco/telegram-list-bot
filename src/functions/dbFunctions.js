const actives = process.env.ACTIVES
const count = process.env.COUNT

module.exports.config = (db) => {
    const clearAllActiveLists = () => {
        return db.set(actives, {})
    }

    const getAllActiveLists = () => {
        return db.get(actives)
    }

    const createActiveListsDb = () => {
        db.JSON({ activeLists: {} })
    }

    const setActiveList = (activeList) => {
        db.set(actives, activeList)
    }

    const getIdCount = () => {
        if (!db.has(count)) {
            db.set(count, 0)
        }
        let idCount = db.get(count)
        db.set(count, idCount + 1)
        return idCount
    }

    const createNewListItem = ({listName, listPrice, listMinValue}, userName) => {
        const activeList = getAllActiveLists()
        const newListItem = {
            id: getIdCount(),
            listName,
            listPrice,
            listMinValue,
            interestedPpl: {},
            totalRequested: 0,
            totalPaid: 0,
            amountToPay: 0,
            isClosed: false,
            owner: userName
        }

        activeList[newListItem.id] = newListItem

        setActiveList(activeList)
        
        return newListItem
    }

    const addQuantityToList = ({listId, desiredQuantity}, userName) => {
        const activeList = getAllActiveLists()
        const selectedList = activeList[listId]

        if(selectedList.isClosed) {
            return 'Unable to add, list is closed'
        }

        const personBag = selectedList.interestedPpl[userName]
        
        if (!personBag) {
            selectedList.interestedPpl[userName] = {desiredQuantity, paid: false}
        } else {
            selectedList.interestedPpl[userName] = {desiredQuantity: desiredQuantity + personBag.desiredQuantity, paid: personBag.paid}
        }

        selectedList.totalRequested += desiredQuantity
        selectedList.amountToPay = selectedList.totalRequested * selectedList.listPrice

        setActiveList(activeList)

        return selectedList
    }

    const removeQuantityToList = ({listId, desiredQuantity}, userName) => {
        const activeList = getAllActiveLists()
        const selectedList = activeList[listId]

        if(selectedList.isClosed) {
            return 'Unable to remove, list is closed'
        }
        const personBag = selectedList.interestedPpl[userName]

        if(desiredQuantity > personBag.desiredQuantity) {
            desiredQuantity = personBag.desiredQuantity
            delete selectedList.interestedPpl[userName]
        } else {
            selectedList.interestedPpl[userName] = {desiredQuantity: personBag.desiredQuantity - desiredQuantity, paid: personBag.paid}
        }

        selectedList.totalRequested -= desiredQuantity
        selectedList.amountToPay = selectedList.totalRequested * selectedList.listPrice

        setActiveList(activeList)

        return selectedList
    }

    const payList = ({listId, desiredQuantity}, userName) => {
        const activeList = getAllActiveLists()
        const selectedList = activeList[listId]
        const personBag = selectedList.interestedPpl[userName]
        const amountPayedNow = personBag.desiredQuantity * selectedList.listPrice

        if(personBag.paid) {
            return selectedList
        }

        selectedList.interestedPpl[userName].paid = true
        selectedList.totalPaid += amountPayedNow

        setActiveList(activeList)

        return selectedList
    }

    const closeList = ({listId}, userName) => {
        const activeList = getAllActiveLists()
        const selectedList = activeList[listId]

        if (selectedList.owner === userName) {
            selectedList.isClosed = true
        }

        setActiveList(activeList)

        return selectedList
    }

    const deleteList = ({listId}, userName) => {
        const activeList = getAllActiveLists()
        const selectedList = activeList[listId]

        if (selectedList.owner === userName) {
            delete activeList[listId]
        }

        setActiveList(activeList)

        return activeList
    }

    const showList = ({listId}) => {
        const activeList = getAllActiveLists()
        const selectedList = activeList[listId]
        return selectedList
    }

    return {
        clearAllActiveLists,
        createActiveListsDb,
        createNewListItem,
        getAllActiveLists,
        setActiveList,
        addQuantityToList,
        removeQuantityToList,
        closeList,
        deleteList,
        payList,
        showList
    }
}
