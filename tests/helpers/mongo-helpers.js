const testConnection = async (connection) => await connection.db('admin').command({ ping: 1 })
const isConnected = async (connection) => {
    try {
        await testConnection(connection)
        return true
    }
    catch {
        return false
    }
}

module.exports = { isConnected }