

export function swapNodes(n1, n2) {
    if (!n1) {
        console.log('swapNodes:n11 is null')
        return;
    }
    var p1 = n1.parentNode;
    var p2 = n2.parentNode;
    var i1, i2;

    if (!p1 || !p2 || p1.isEqualNode(n2) || p2.isEqualNode(n1)) return;

    for (var i = 0; i < p1.children.length; i++) {
        if (p1.children[i].isEqualNode(n1)) {
            i1 = i;
        }
    }
    for (var i = 0; i < p2.children.length; i++) {
        if (p2.children[i].isEqualNode(n2)) {
            i2 = i;
        }
    }

    if (p1.isEqualNode(p2) && i1 < i2) {
        i2++;
    }
    p1.insertBefore(n2, p1.children[i1]);
    p2.insertBefore(n1, p2.children[i2]);
}

export function doSwap(divSrc, divDes) {
    swapNodes(divSrc, divDes)
}