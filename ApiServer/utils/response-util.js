

function createHttpResponse({ content, status, message }) {
    return {
        statusCode: status,
        message: message,
        response: content
    }
}

module.exports = ({
    createHttpResponse
});