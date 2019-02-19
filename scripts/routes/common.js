
exports.send = (res, status, payload, message) => {
    var response = {
        status: status,
        payload: payload,
        message: message
    };

    return res.send(response);
}