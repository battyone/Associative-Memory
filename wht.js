
function whtVec(vec) {
    var n = vec.length;
    var hs = 1;
    while (hs < n) {
        var i = 0;
        while (i < n) {
            const j = i + hs;
            while (i < j) {
                var a = vec[i];
                var b = vec[i + hs];
                vec[i] = a + b;
                vec[i + hs] = a - b;
                i += 1;
            }
            i += hs;
        }
        hs += hs;
    }
    scaleVec(vec, vec, 1.0 / Math.sqrt(n));
}

function signFlipVec(vec, hash) {
    for (var i = 0, n = vec.length; i < n; i++) {
        hash += 0x3C6EF35F;
        hash *=0x19660D;
        hash &= 0xffffffff;        
        if (((hash*0x9E3779B9) & 0x80000000) === 0) {
            vec[i] = -vec[i];
        }
    }
}

function rpVec(vec, hash) {
    signFlipVec(vec, hash);
    whtVec(vec);
}

function scaleVec(rVec, xVec, sc) {
    for (var i = 0, n = rVec.length; i < n; i++) {
        rVec[i] = xVec[i] * sc;
    }
}

function multiplyVec(rVec, xVec, yVec) {
    for (var i = 0, n = rVec.length; i < n; i++) {
        rVec[i] = xVec[i] * yVec[i];
    }
}

function multiplyAddToVec(rVec, xVec, yVec) {
    for (var i = 0, n = rVec.length; i < n; i++) {
        rVec[i] += xVec[i] * yVec[i];
    }
}

  // x-y
function subtractVec(rVec, xVec, yVec) {
    for (var i = 0, n = rVec.length; i < n; i++) {
        rVec[i] = xVec[i] - yVec[i];
    }
}

function addVec(rVec, xVec, yVec) {
    for (var i = 0, n = rVec.length; i < n; i++) {
        rVec[i] = xVec[i] + yVec[i];
    }
}

// converts each element of xVec to +1 or -1 according to its sign.
function signOfVec(rVec, xVec) {
    for (var i = 0, n = rVec.length; i < n; i++) {
        if (xVec[i] < 0.0) {
            rVec[i] = -1.0;
        } else {
            rVec[i] = 1.0;
        }
    }
}

function truncateVec(rVec, xVec, t) {
    for (var i = 0, n = rVec.length; i < n; i++) {
        var tt = Math.abs(xVec[i]) - t;
        if (tt < 0.0) {
            rVec[i] = 0.0;
            continue;
        }
        if (xVec[i] < 0.0) {
            rVec[i] = -tt;
        } else {
            rVec[i] = tt;
        }
    }
}

function sumSqVec(vec) {
    var sum = 0.0;
    for (var i = 0, n = vec.length; i < n; i++) {
        sum += vec[i] * vec[i];
    }
    return sum;
}

// Adjust variance/sd
function adjustVec(rVec, xVec, scale) {
    var MIN_SQ = 1e-20;
    var adj = scale / Math.sqrt((sumSq(xVec) / xVec.length) + MIN_SQ);
    scaleVec(rVec, xVec, adj);
}

function copyVec(rVec, xVec) {
    for (var i = 0, n = rVec.length; i < n; i++) {
        rVec[i] = xVec[i];
    }
}

function zeroVec(x){
    for (var i = 0, n = x.length; i < n; i++) {
        x[i]=0;
    }
}



