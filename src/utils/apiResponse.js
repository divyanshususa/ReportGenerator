class apiResponse {
    constructor(data = "", message, success = false) {
        this.data = data;
        this.message = message;
        this.success = success;
    }
}

export { apiResponse }