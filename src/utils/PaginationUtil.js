

export function page(object) {
    return {
        totalElements: parseInt(object.totalElements, 10), //totalItemsCount
        number: parseInt(object.number) + 1, //activePage
        size: parseInt(object.size) //itemsCountPerPage
    };
}
